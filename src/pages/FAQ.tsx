
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const FAQ = () => {
  const faqs = [
    {
      question: "How long does it take to create my custom name pendant?",
      answer: "Most custom name pendants are completed within 3-5 business days. During busy periods, it may take up to 7 business days. Rush orders are available for an additional fee."
    },
    {
      question: "What materials are used in your pendants?",
      answer: "We use high-quality materials including gold-plated brass, rose gold-plated brass, sterling silver, and stainless steel. All materials are hypoallergenic and tarnish-resistant."
    },
    {
      question: "Can I change my order after it's been placed?",
      answer: "Changes can only be made within 2 hours of placing your order. After this time, production begins and changes are not possible due to the custom nature of our products."
    },
    {
      question: "What font options are available?",
      answer: "We offer 6 beautiful font styles: Great Vibes, Cookie, Ephesis, Pacifico, Lily Script One, and Gwendolyn. You can preview your name in each font before ordering."
    },
    {
      question: "How do I care for my name pendant?",
      answer: "Keep your pendant dry and avoid contact with perfumes, lotions, and cleaning products. Store in a dry place, preferably in the provided jewelry box. Clean gently with a soft cloth."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship worldwide from India. International shipping typically takes 7-14 business days. Customs duties and taxes may apply depending on your country."
    },
    {
      question: "What if I receive a damaged item?",
      answer: "If you receive a damaged item, please contact us immediately at hello@attiry.com with photos. We'll arrange for a replacement or full refund at no cost to you."
    },
    {
      question: "Can I return a custom engraved pendant?",
      answer: "Yes, custom engraved pendants can be returned within 7 days if there's a manufacturing defect or if you're not satisfied with the quality. The pendant must be in original condition."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can use this number to track your package on the carrier's website."
    },
    {
      question: "Do you offer gift wrapping?",
      answer: "Yes, all our pendants come in elegant gift boxes at no additional cost. We can also include a personalized gift message with your order."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-background py-12"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-cormorant text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about our custom name pendants
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center p-6 bg-accent/10 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
            <p className="text-muted-foreground mb-4">
              We're here to help! Contact our customer service team for personalized assistance.
            </p>
            <div className="space-y-2">
              <p className="font-medium">Email: hello@attiry.com</p>
              <p className="font-medium">Phone: +1 (555) 123-4567</p>
              <p className="text-sm text-muted-foreground">Response time: Within 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
