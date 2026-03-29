import React, { useState } from 'react';
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
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState(1);

  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    mobile: '',
    address: '',
    pincode: '',
    paymentMethod: 'COD',
    paymentCompleted: false,
  });

  const handleBuyNow = (product: Product) => {
    setSelectedProduct(product);
    setIsOrderModalOpen(true);
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

    setIsSubmitting(true);

    const orderStatus: OrderStatus = formData.paymentMethod === 'QR' && formData.paymentCompleted ? 'PAID' : 'UNPAID';

    const orderPayload = {
      ...formData,
      product: selectedProduct,
      status: orderStatus,
    };

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        setOrderSubmitted(true);
        setTimeout(() => {
          setIsOrderModalOpen(false);
          setOrderSubmitted(false);
          setFormData({
            name: '',
            mobile: '',
            address: '',
            pincode: '',
            paymentMethod: 'COD',
            paymentCompleted: false,
          });
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting order:", error);
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
              className="group flex flex-col"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-6 cursor-zoom-in" onClick={() => setPreviewImage(product.image)}>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                   <div className="flex gap-2">
                     <button 
                      onClick={(e) => { e.stopPropagation(); handleBuyNow(product); }}
                      className="bg-white text-luxury-dark px-6 py-2 text-xs uppercase tracking-widest font-bold hover:bg-luxury-gold hover:text-white transition-all"
                     >
                       Quick View
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

              <button 
                onClick={() => handleBuyNow(product)}
                className="btn-primary w-full"
              >
                Buy Now
              </button>
            </motion.div>
          ))}
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
            <div className="flex border-b border-white/20 pb-2">
              <input type="email" placeholder="Email Address" className="bg-transparent text-sm outline-none w-full" />
              <button><ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-[10px] uppercase tracking-[0.2em] opacity-30 flex justify-between">
          <p>© 2026 Luxe Almirah Boutique</p>
          <p>Privacy Policy / Terms of Service</p>
        </div>
      </footer>

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

                    <form onSubmit={handleSubmitOrder} className="space-y-6">
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
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            className="input-field" 
                            placeholder="+91 XXXXX XXXXX"
                          />
                        </div>
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
                                src="https://i.ibb.co/v6q43hCV/29071991-6176-4344-b76a-93c19dd79eb9.png" 
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
