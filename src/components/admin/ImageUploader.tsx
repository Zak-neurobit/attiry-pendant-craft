
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  imageUrls: string[];
  onImagesChange: (urls: string[]) => void;
  productId?: string;
}

interface UploadingImage {
  id: string;
  file: File;
  progress: number;
  url?: string;
  error?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrls,
  onImagesChange,
  productId
}) => {
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);
  const { toast } = useToast();

  const generateImagePath = (file: File): string => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const folder = productId ? `product_${productId}` : `draft_${Date.now()}`;
    return `${folder}/${fileName}`;
  };

  const uploadFile = async (file: File): Promise<string> => {
    const filePath = generateImagePath(file);
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newUploads: UploadingImage[] = acceptedFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      progress: 0
    }));

    setUploadingImages(prev => [...prev, ...newUploads]);

    for (const upload of newUploads) {
      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadingImages(prev => prev.map(img => 
            img.id === upload.id 
              ? { ...img, progress: Math.min(img.progress + 10, 90) }
              : img
          ));
        }, 200);

        const url = await uploadFile(upload.file);
        
        clearInterval(progressInterval);
        
        setUploadingImages(prev => prev.map(img => 
          img.id === upload.id 
            ? { ...img, progress: 100, url }
            : img
        ));

        // Add to image URLs
        onImagesChange([...imageUrls, url]);

        toast({
          title: "Image uploaded",
          description: `${upload.file.name} uploaded successfully`,
        });

      } catch (error: any) {
        setUploadingImages(prev => prev.map(img => 
          img.id === upload.id 
            ? { ...img, error: error.message, progress: 0 }
            : img
        ));

        toast({
          title: "Upload failed",
          description: error.message,
          variant: "destructive",
        });
      }
    }

    // Clean up completed uploads after a delay
    setTimeout(() => {
      setUploadingImages(prev => prev.filter(img => 
        img.progress < 100 && !img.error
      ));
    }, 2000);
  }, [imageUrls, onImagesChange, toast]);

  const removeImage = async (urlToRemove: string) => {
    try {
      // Extract the file path from the URL
      const urlParts = urlToRemove.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const folder = urlParts[urlParts.length - 2];
      const filePath = `${folder}/${fileName}`;

      // Delete from storage
      const { error } = await supabase.storage
        .from('product-images')
        .remove([filePath]);

      if (error) {
        console.warn('Failed to delete file from storage:', error);
      }

      // Remove from URLs
      onImagesChange(imageUrls.filter(url => url !== urlToRemove));
      
      toast({
        title: "Image removed",
        description: "Image deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true
  });

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
          }
        `}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground mb-4">
          {isDragActive
            ? "Drop images here..."
            : "Drag and drop images here, or click to select files"
          }
        </p>
        <Badge variant="outline" className="mb-2">
          JPG, PNG, WebP up to 5MB
        </Badge>
        <Button type="button" variant="outline">
          Choose Files
        </Button>
      </div>

      {/* Uploading Images */}
      {uploadingImages.length > 0 && (
        <div className="space-y-2">
          {uploadingImages.map((upload) => (
            <Card key={upload.id} className="p-3">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{upload.file.name}</p>
                  {upload.error ? (
                    <div className="flex items-center gap-1 text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      <span className="text-xs">{upload.error}</span>
                    </div>
                  ) : (
                    <Progress value={upload.progress} className="mt-1" />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Uploaded Images */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imageUrls.map((url, index) => (
            <div key={url} className="relative group">
              <div className="relative aspect-square rounded-lg overflow-hidden border">
                <img
                  src={url}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage(url)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {index === 0 && (
                <Badge className="absolute -top-2 -left-2">Primary</Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
