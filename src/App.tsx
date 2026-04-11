import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, CheckCircle2, Phone, MapPin, User, ArrowRight, ShieldCheck, Ruler, Layers, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from './constants';
import { Product, OrderFormData, OrderStatus } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState(1);

  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    pincode: '',
    paymentMethod: 'COD',
    paymentCompleted: false,
  });

  const REVIEWS = [
    { name: "Rahul Sharma", rating: 5, comment: "Best quality almirah I have ever bought. Very sturdy and looks premium." },
    { name: "Priya Singh", rating: 5, comment: "Best service! The delivery was on time and the installation was smooth." },
    { name: "Amit Kumar", rating: 4, comment: "Great product for the price. The steel quality is top-notch." },
    { name: "Sneha Gupta", rating: 5, comment: "The pink almirah looks even better in person. My daughter loves it!" },
    { name: "Vikram Singh", rating: 5, comment: "Excellent build quality. Highly recommended for anyone looking for durable storage." },
    { name: "Anjali Devi", rating: 5, comment: "Very spacious and the mirror is of good quality. Happy with the purchase." },
    { name: "Rajesh Jha", rating: 4, comment: "Good service and product. The locking system is very secure." },
    { name: "Meera Kumari", rating: 5, comment: "Beautiful design. It fits perfectly in my bedroom." },
    { name: "Sandeep Yadav", rating: 5, comment: "Strong and durable. ALFA brand never disappoints." },
    { name: "Kavita Roy", rating: 5, comment: "The blue almirah is very stylish. Great addition to my home." },
    { name: "Manish Mishra", rating: 4, comment: "Solid construction. Worth every penny." },
    { name: "Pooja Sharma", rating: 5, comment: "Fast delivery and great customer support. Thank you!" },
    { name: "Arjun Singh", rating: 5, comment: "The finish is very smooth. It's easy to clean as well." },
    { name: "Sunita Verma", rating: 5, comment: "Highly satisfied with the quality. It's very heavy and stable." },
    { name: "Rohan Gupta", rating: 4, comment: "Good almirah. The storage capacity is impressive." },
    { name: "Deepak Kumar", rating: 5, comment: "Best service in Darbhanga. Very professional team." },
    { name: "Neetu Singh", rating: 5, comment: "Elegant look and strong body. Perfect for daily use." },
    { name: "Suresh Prasad", rating: 5, comment: "The mirror is full length and very clear. Great feature." },
    { name: "Anita Devi", rating: 4, comment: "Very durable steel. I'm sure it will last for years." },
    { name: "Vijay Kumar", rating: 5, comment: "Premium quality at a reasonable price. Very happy." },
    { name: "Ritu Sharma", rating: 5, comment: "The locking mechanism is very smooth and feels safe." },
    { name: "Alok Singh", rating: 5, comment: "Great experience buying from Luxe Almirah. Best service." },
    { name: "Sapna Kumari", rating: 5, comment: "The color options are great. The pink one is my favorite." },
    { name: "Pankaj Yadav", rating: 4, comment: "Sturdy build. It can hold a lot of weight." },
    { name: "Jyoti Gupta", rating: 5, comment: "Excellent product. The delivery staff was very helpful." },
    { name: "Abhishek Jha", rating: 5, comment: "Top quality steel used. No complaints at all." },
    { name: "Suman Devi", rating: 5, comment: "Very modern design. It looks very expensive." },
    { name: "Rakesh Kumar", rating: 4, comment: "Good value for money. The almirah is very strong." },
    { name: "Preeti Singh", rating: 5, comment: "Best quality almirah in the market. Highly durable." },
    { name: "Nitin Verma", rating: 5, comment: "Great service and quick response to my queries." },
    { name: "Swati Roy", rating: 5, comment: "The almirah is very spacious. I can organize everything easily." },
    { name: "Karan Singh", rating: 4, comment: "Solid product. The mirror adds a nice touch." },
    { name: "Madhu Kumari", rating: 5, comment: "Very happy with the purchase. The quality is amazing." },
    { name: "Sanjay Yadav", rating: 5, comment: "Best service and best quality. Highly recommended." },
    { name: "Annu Sharma", rating: 5, comment: "The finish is premium. It doesn't scratch easily." },
    { name: "Rahul Gupta", rating: 4, comment: "Good storage solution. The steel is quite thick." },
    { name: "Priyanka Singh", rating: 5, comment: "Beautiful almirah. It has changed the look of my room." },
    { name: "Vivek Kumar", rating: 5, comment: "Excellent build. The doors close very smoothly." },
    { name: "Soni Devi", rating: 5, comment: "Very satisfied. The product is exactly as described." },
    { name: "Manoj Jha", rating: 5, comment: "Best quality almirah. The service was exceptional." }
  ];

  const handleBuyNow = (product: Product) => {
    setSelectedProduct(product);
    setIsOrderModalOpen(true);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (method: 'COD' | 'QR') => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    // Validate that all fields are filled
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.pincode.trim()) {
      alert("Please fill all the fields: Full Name, Email, Mobile Number, Address, and Pincode");
      return;
    }

    setIsSubmitting(true);

    const orderStatus: OrderStatus = formData.paymentMethod === 'QR' && formData.paymentCompleted ? 'PAID' : 'UNPAID';

    try {
      console.log("Starting order submission to Formspree...");
      
      const response = await fetch("https://formspree.io/f/xdapqzen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          pincode: formData.pincode,
          product_name: selectedProduct.name,
          product_price: selectedProduct.price,
          payment_method: formData.paymentMethod,
          payment_status: orderStatus,
        })
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      console.log("Order submitted successfully!");

      alert("Order placed successfully");
      setOrderSubmitted(true);
      setTimeout(() => {
        setIsOrderModalOpen(false);
        setOrderSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          pincode: '',
          paymentMethod: 'COD',
          paymentCompleted: false,
        });
      }, 3000);
    } catch (error: any) {
      console.error("Submission failed:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-luxury-dark/5 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-serif font-bold tracking-tighter uppercase">LUXE ALMIRAH</h1>
        <div className="hidden md:flex gap-8 text-xs uppercase tracking-widest font-medium">
          <a href="#" className="hover:text-luxury-gold transition-colors">Collections</a>
          <a href="#" className="hover:text-luxury-gold transition-colors">Craftsmanship</a>
          <a href="#" className="hover:text-luxury-gold transition-colors">Bespoke</a>
        </div>
        <button className="p-2 hover:bg-luxury-dark/5 rounded-full transition-colors">
          <ShoppingBag size={20} />
        </button>
      </nav>

      {/* Hero Section */}
      <header className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-luxury-dark text-white">
        <img 
          src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80&w=2000" 
          alt="Luxury Bedroom" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          referrerPolicy="no-referrer"
        />
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.3em] font-medium text-luxury-gold mb-4 block"
          >
            The Art of Living
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-serif mb-6 leading-tight"
          >
            Timeless Elegance for Your Sanctuary
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm md:text-base font-light tracking-wide opacity-80 mb-8"
          >
            Discover our curated collection of premium wardrobes, where traditional craftsmanship meets modern sophistication.
          </motion.p>
        </div>
      </header>

      {/* Product Display */}
      <main className="max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h3 className="text-3xl font-serif mb-2 italic">Exquisite Collections</h3>
            <p className="text-sm text-luxury-dark/60">Handpicked designs for the discerning homeowner.</p>
          </div>
          <div className="h-[1px] flex-grow bg-luxury-dark/10 mx-8 hidden md:block"></div>
          <span className="text-xs uppercase tracking-widest font-semibold opacity-40">01 / 03</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {PRODUCTS.map((product) => (
            <motion.div 
              key={product.id}
              whileHover={{ y: -10 }}
              className="group flex flex-col cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-6" onClick={(e) => { e.stopPropagation(); setPreviewImage(product.image); }}>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                   <div className="flex gap-2">
                     <button 
                      onClick={(e) => { e.stopPropagation(); handleProductClick(product); }}
                      className="bg-white text-luxury-dark px-6 py-2 text-xs uppercase tracking-widest font-bold hover:bg-luxury-gold hover:text-white transition-all"
                     >
                       View Details
                     </button>
                     <button 
                      onClick={(e) => { e.stopPropagation(); setPreviewImage(product.image); }}
                      className="bg-white text-luxury-dark p-2 hover:bg-luxury-gold hover:text-white transition-all"
                     >
                       <Maximize2 size={16} />
                     </button>
                   </div>
                </div>
              </div>
              
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-serif">{product.name}</h4>
                <span className="text-lg font-medium text-luxury-gold">{product.price}</span>
              </div>

              <div className="space-y-3 mb-8 flex-grow">
                <div className="flex items-center gap-3 text-xs opacity-70">
                  <Layers size={14} className="text-luxury-gold" />
                  <span><strong>Material:</strong> {product.material}</span>
                </div>
                <div className="flex items-center gap-3 text-xs opacity-70">
                  <Ruler size={14} className="text-luxury-gold" />
                  <span><strong>Dimensions:</strong> {product.dimensions}</span>
                </div>
                <div className="flex items-center gap-3 text-xs opacity-70">
                  <ShieldCheck size={14} className="text-luxury-gold" />
                  <span><strong>Warranty:</strong> {product.warranty}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-8">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-green-700 bg-green-50 px-3 py-1.5 border border-green-100">
                  <span>Cash on Delivery Available 🚚</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1.5 border border-blue-100">
                  <span>Delivery in 2–3 Days ⏱️</span>
                </div>
              </div>

              <button 
                onClick={(e) => { e.stopPropagation(); handleBuyNow(product); }}
                className="btn-primary w-full"
              >
                Buy Now
              </button>
            </motion.div>
          ))}
        </div>

        {/* Reviews Section */}
        <div className="mt-32">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h3 className="text-3xl font-serif mb-2 italic">Customer Reviews</h3>
              <p className="text-sm text-luxury-dark/60">What our clients say about our quality and service.</p>
            </div>
            <div className="h-[1px] flex-grow bg-luxury-dark/10 mx-8 hidden md:block"></div>
            <span className="text-xs uppercase tracking-widest font-semibold opacity-40">{REVIEWS.length} Reviews</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {REVIEWS.slice(0, 6).map((review, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-luxury-cream p-8 border border-luxury-dark/5 shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={cn("text-sm", i < review.rating ? "text-luxury-gold" : "text-gray-300")}>★</span>
                  ))}
                </div>
                <p className="text-sm italic mb-6 opacity-80">"{review.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-luxury-dark text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">{review.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* All Reviews Modal Trigger */}
          <div className="mt-12 text-center">
            <button 
              onClick={() => {}} // Could open a full reviews modal if needed
              className="text-xs uppercase tracking-widest font-bold border-b border-luxury-dark pb-1 hover:text-luxury-gold hover:border-luxury-gold transition-all"
            >
              View All {REVIEWS.length} Reviews
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-luxury-dark text-white py-16 px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-serif mb-6 tracking-tighter">LUXE ALMIRAH</h2>
            <p className="text-sm font-light opacity-60 max-w-md leading-relaxed">
              Crafting legacies since 1992. Our furniture is more than just storage; it's a testament to the beauty of natural materials and human skill.
            </p>
          </div>
          <div>
            <h5 className="text-xs uppercase tracking-widest font-bold mb-6 text-luxury-gold">Contact</h5>
            <div className="space-y-4 text-sm opacity-60 font-light">
              <p className="flex items-center gap-3"><Phone size={14} /> +91 93045 19971</p>
              <p className="flex items-center gap-3"><MapPin size={14} /> Darbhanga, Bihar</p>
              <p className="flex items-center gap-3"><ShoppingBag size={14} /> biskitip@gmail.com</p>
            </div>
          </div>
          <div>
            <h5 className="text-xs uppercase tracking-widest font-bold mb-6 text-luxury-gold">Newsletter</h5>
            <form 
              action="https://formspree.io/f/xdapqzen"
              method="POST"
              onSubmit={async (e) => {
                e.preventDefault();
                const emailInput = (e.target as HTMLFormElement).elements.namedItem('email') as HTMLInputElement;
                const email = emailInput.value;
                if (!email) return;
                
                try {
                  console.log("Starting newsletter subscription to Formspree...");
                  
                  const response = await fetch("https://formspree.io/f/xdapqzen", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "Accept": "application/json"
                    },
                    body: JSON.stringify({
                      email: email,
                      subject: 'New newsletter subscription' 
                    })
                  });

                  if (!response.ok) {
                    throw new Error("Subscription failed");
                  }

                  console.log("Newsletter submitted successfully!");
                  
                  alert("Subscribed successfully!");
                  emailInput.value = '';
                } catch (error: any) {
                  console.error("Newsletter subscription failed:", error);
                  alert("Something went wrong. Please try again later.");
                }
              }}
              className="flex border-b border-white/20 pb-2"
            >
              <input 
                type="email" 
                name="email"
                placeholder="Email Address" 
                className="bg-transparent text-sm outline-none w-full" 
                required
              />
              <button type="submit"><ArrowRight size={16} /></button>
            </form>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-[10px] uppercase tracking-[0.2em] opacity-30 flex justify-between">
          <p>© 2026 Luxe Almirah</p>
          <p>Privacy Policy / Terms of Service</p>
        </div>
      </footer>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute inset-0 bg-luxury-dark/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-luxury-cream overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
                <span className="text-xs uppercase tracking-[0.3em] font-medium text-luxury-gold mb-4 block">Premium Collection</span>
                <h3 className="text-3xl font-serif mb-4">{selectedProduct.name}</h3>
                <p className="text-2xl font-medium text-luxury-gold mb-8">{selectedProduct.price}</p>
                
                <div className="space-y-6 mb-10">
                  <div>
                    <h5 className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2">Description</h5>
                    <p className="text-sm leading-relaxed opacity-80">{selectedProduct.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2">Material</h5>
                      <p className="text-xs font-medium">{selectedProduct.material}</p>
                    </div>
                    <div>
                      <h5 className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2">Dimensions</h5>
                      <p className="text-xs font-medium">{selectedProduct.dimensions}</p>
                    </div>
                    <div>
                      <h5 className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2">Warranty</h5>
                      <p className="text-xs font-medium">{selectedProduct.warranty}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mb-10 p-4 bg-white border border-luxury-dark/5">
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-green-700">
                    <span className="text-lg">🚚</span>
                    <span>Cash on Delivery Available</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-blue-700">
                    <span className="text-lg">⏱️</span>
                    <span>Delivery in 2–3 Days</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      handleBuyNow(selectedProduct);
                    }}
                    className="btn-primary flex-grow py-4"
                  >
                    Buy Now
                  </button>
                  <button 
                    onClick={() => {
                      setPreviewImage(selectedProduct.image);
                    }}
                    className="border border-luxury-dark/20 py-4 px-6 hover:bg-luxury-dark hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Maximize2 size={16} /> Full View
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Modal */}
      <AnimatePresence>
        {isOrderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsOrderModalOpen(false)}
              className="absolute inset-0 bg-luxury-dark/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-luxury-cream overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              {orderSubmitted ? (
                <div className="w-full p-12 flex flex-col items-center justify-center text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 size={40} />
                  </motion.div>
                  <h3 className="text-3xl font-serif mb-2">Order Confirmed</h3>
                  <p className="text-sm opacity-60">Thank you for your purchase. Our concierge will contact you shortly.</p>
                </div>
              ) : (
                <>
                  {/* Product Summary (Hidden on mobile) */}
                  <div className="hidden md:block w-1/3 bg-luxury-dark text-white p-8">
                    <img 
                      src={selectedProduct?.image} 
                      alt={selectedProduct?.name} 
                      className="w-full aspect-[3/4] object-cover mb-6 grayscale hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <h4 className="text-xl font-serif mb-2">{selectedProduct?.name}</h4>
                    <p className="text-luxury-gold font-medium mb-4">{selectedProduct?.price}</p>
                    <div className="space-y-2 text-[10px] uppercase tracking-widest opacity-60">
                      <p>Material: {selectedProduct?.material}</p>
                      <p>Warranty: {selectedProduct?.warranty}</p>
                    </div>
                  </div>

                  {/* Order Form */}
                  <div className="flex-grow p-8 md:p-10">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="text-2xl font-serif italic">Complete Your Order</h3>
                        <p className="text-xs opacity-50 uppercase tracking-widest mt-1">Shipping & Payment Details</p>
                      </div>
                      <button 
                        onClick={() => setIsOrderModalOpen(false)}
                        className="p-1 hover:bg-luxury-dark/5 rounded-full transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <form 
                      action="https://formspree.io/f/xdapqzen"
                      method="POST"
                      onSubmit={handleSubmitOrder} 
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 flex items-center gap-2">
                            <User size={10} /> Full Name
                          </label>
                          <input 
                            required
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="input-field" 
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 flex items-center gap-2">
                            <Phone size={10} /> Mobile Number
                          </label>
                          <input 
                            required
                            type="tel" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="input-field" 
                            placeholder="+91 XXXXX XXXXX"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 flex items-center gap-2">
                          <ShoppingBag size={10} /> Email Address
                        </label>
                        <input 
                          required
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="input-field" 
                          placeholder="john@example.com"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 flex items-center gap-2">
                          <MapPin size={10} /> Delivery Address
                        </label>
                        <textarea 
                          required
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={2}
                          className="input-field resize-none" 
                          placeholder="House No, Street, Area..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Pincode</label>
                        <input 
                          required
                          type="text" 
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className="input-field" 
                          placeholder="400001"
                        />
                      </div>

                      <div className="space-y-4 pt-4">
                        <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 block">Payment Method</label>
                        <div className="grid grid-cols-2 gap-4">
                          <button 
                            type="button"
                            onClick={() => handlePaymentMethodChange('COD')}
                            className={cn(
                              "py-3 text-[10px] uppercase tracking-widest font-bold border transition-all",
                              formData.paymentMethod === 'COD' 
                                ? "bg-luxury-dark text-white border-luxury-dark" 
                                : "bg-transparent text-luxury-dark border-luxury-dark/10 hover:border-luxury-dark/40"
                            )}
                          >
                            Cash on Delivery
                          </button>
                          <button 
                            type="button"
                            onClick={() => handlePaymentMethodChange('QR')}
                            className={cn(
                              "py-3 text-[10px] uppercase tracking-widest font-bold border transition-all",
                              formData.paymentMethod === 'QR' 
                                ? "bg-luxury-dark text-white border-luxury-dark" 
                                : "bg-transparent text-luxury-dark border-luxury-dark/10 hover:border-luxury-dark/40"
                            )}
                          >
                            QR Code Payment
                          </button>
                        </div>

                        {formData.paymentMethod === 'QR' && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-white p-6 border border-luxury-dark/5 flex flex-col items-center gap-4"
                          >
                            <div className="w-56 h-56 bg-white p-2 flex items-center justify-center border border-luxury-dark/10 shadow-sm">
                              <img 
                                src="https://i.ibb.co/QFQRhVhh/29071991-6176-4344-b76a-93c19dd79eb9.png" 
                                alt="Payment QR Code" 
                                className="w-full h-full object-contain"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <p className="text-[10px] text-center opacity-60 uppercase tracking-widest">Scan to pay securely via UPI</p>
                            <label className="flex items-center gap-3 cursor-pointer group">
                              <div className={cn(
                                "w-5 h-5 border flex items-center justify-center transition-all",
                                formData.paymentCompleted ? "bg-green-600 border-green-600" : "border-luxury-dark/20 group-hover:border-luxury-dark/60"
                              )}>
                                {formData.paymentCompleted && <CheckCircle2 size={14} className="text-white" />}
                              </div>
                              <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={formData.paymentCompleted}
                                onChange={(e) => setFormData(prev => ({ ...prev, paymentCompleted: e.target.checked }))}
                              />
                              <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">Payment Completed</span>
                            </label>
                          </motion.div>
                        )}
                      </div>

                      <button 
                        disabled={isSubmitting}
                        type="submit" 
                        className="btn-primary w-full mt-4 flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Processing...' : (
                          <>Confirm Order <ArrowRight size={16} /></>
                        )}
                      </button>
                    </form>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Image Preview Lightbox */}
      <AnimatePresence>
        {previewImage && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setPreviewImage(null); setZoomScale(1); }}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            
            <div className="relative w-full h-full flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative max-w-full max-h-full overflow-auto scrollbar-hide flex items-center justify-center"
              >
                <motion.img 
                  src={previewImage} 
                  alt="Preview" 
                  animate={{ scale: zoomScale }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="max-w-full max-h-[85vh] object-contain shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Controls */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-full">
                <button 
                  onClick={() => setZoomScale(prev => Math.max(0.5, prev - 0.25))}
                  className="p-3 text-white hover:bg-white/20 rounded-full transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut size={20} />
                </button>
                <span className="text-white text-xs font-mono w-12 text-center">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button 
                  onClick={() => setZoomScale(prev => Math.min(3, prev + 0.25))}
                  className="p-3 text-white hover:bg-white/20 rounded-full transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn size={20} />
                </button>
                <div className="w-[1px] h-6 bg-white/20 mx-1" />
                <button 
                  onClick={() => { setPreviewImage(null); setZoomScale(1); }}
                  className="p-3 text-white hover:bg-white/20 rounded-full transition-colors"
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Top Close Button */}
              <button 
                onClick={() => { setPreviewImage(null); setZoomScale(1); }}
                className="absolute top-6 right-6 p-4 text-white/60 hover:text-white transition-colors"
              >
                <X size={32} />
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
