
import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Button from '../components/Button';

const ContactPage = () => {
  return (
    <div className="bg-deepNavy min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:row gap-16">
          <div className="lg:w-1/3">
            <h1 className="text-6xl font-black italic uppercase leading-none tracking-tighter mb-8">
              Get in <br /> <span className="text-rugbyRed">Touch</span>
            </h1>
            <p className="text-lg font-bold text-gray-400 mb-12 uppercase leading-relaxed">
              Questions about teams, tickets, or media accreditation? Our logistics team is ready.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-center space-x-6">
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center text-rugbyRed border border-white/10"><Mail /></div>
                <div>
                  <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">EMAIL US</h4>
                  <p className="font-bold">hello@amsterdamrugby7s.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center text-rugbyRed border border-white/10"><Phone /></div>
                <div>
                  <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">CALL OFFICE</h4>
                  <p className="font-bold">+31 (0) 20 123 4567</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center text-rugbyRed border border-white/10"><MapPin /></div>
                <div>
                  <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">OFFICE LOCATION</h4>
                  <p className="font-bold">Sloterdijk Business Park, NL</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-2/3">
            <div className="bg-white p-10 skew-x-[-2deg]">
               <div className="skew-x-[2deg]">
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-deepNavy">Your Name</label>
                        <input type="text" className="w-full bg-deepNavy/5 border-2 border-transparent focus:border-rugbyRed focus:bg-white px-4 py-3 text-deepNavy transition-all outline-none font-bold" placeholder="JOHN DOE" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-deepNavy">Email Address</label>
                        <input type="email" className="w-full bg-deepNavy/5 border-2 border-transparent focus:border-rugbyRed focus:bg-white px-4 py-3 text-deepNavy transition-all outline-none font-bold" placeholder="JOHN@EXAMPLE.COM" />
                      </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-deepNavy">Subject</label>
                        <select className="w-full bg-deepNavy/5 border-2 border-transparent focus:border-rugbyRed focus:bg-white px-4 py-3 text-deepNavy transition-all outline-none font-bold uppercase">
                          <option>TEAM REGISTRATION</option>
                          <option>TICKETING ENQUIRY</option>
                          <option>VOLUNTEER APPLICATION</option>
                          <option>SPONSORSHIP OPPORTUNITY</option>
                          <option>OTHER</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-deepNavy">Message</label>
                        <textarea rows={5} className="w-full bg-deepNavy/5 border-2 border-transparent focus:border-rugbyRed focus:bg-white px-4 py-3 text-deepNavy transition-all outline-none font-bold" placeholder="HOW CAN WE HELP?"></textarea>
                    </div>
                    <Button type="submit" variant="primary" className="w-full">
                       <div className="flex items-center space-x-2">
                         <span>Transmit Message</span>
                         <Send size={18} />
                       </div>
                    </Button>
                  </form>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
