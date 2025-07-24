
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart } from '@/stores/cart';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
};

export const CartDrawer = () => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getTotalItems,
    getSubtotal,
    getDiscount,
    getTotal,
  } = useCart();

  const drawerVariants = {
    closed: {
      x: '100%',
    },
    open: {
      x: 0,
    },
  };

  const overlayVariants = {
    closed: {
      opacity: 0,
    },
    open: {
      opacity: 1,
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-black/50 z-50"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-lg z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5" />
                <h2 className="text-lg font-semibold">
                  Your Cart ({getTotalItems()})
                </h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeCart}
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 flex flex-col">
              {items.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="text-center space-y-4">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="font-medium text-foreground mb-2">
                        Your cart is empty
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add some beautiful pendants to get started
                      </p>
                      <Button asChild onClick={closeCart}>
                        <Link to="/shop">Start Shopping</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-4">
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-4 p-4 border rounded-lg bg-card"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 rounded-md object-cover"
                          />
                          <div className="flex-1 space-y-2">
                            <div>
                              <h3 className="font-medium text-sm line-clamp-2">
                                {item.title}
                              </h3>
                              <div className="text-xs text-muted-foreground space-y-1">
                                <p>"{item.customText}"</p>
                                <p>{item.color.replace('_', ' ')} • {item.font}</p>
                                <p>{item.chain?.replace('-', ' ')}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-sm font-medium">
                                  {formatPrice(item.price * item.quantity)}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 text-destructive hover:text-destructive"
                                  onClick={() => removeItem(item.id)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Cart Summary */}
                  <div className="border-t p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>{formatPrice(getSubtotal())}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center space-x-2">
                          <span>Discount</span>
                          <Badge variant="secondary" className="text-xs">
                            25% OFF
                          </Badge>
                        </span>
                        <span className="text-accent">
                          -{formatPrice(getDiscount())}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>{formatPrice(getTotal())}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full" size="lg" asChild>
                        <Link to="/checkout" onClick={closeCart}>
                          Checkout
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={closeCart}
                        asChild
                      >
                        <Link to="/shop">Continue Shopping</Link>
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
