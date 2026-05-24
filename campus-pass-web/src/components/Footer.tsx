import { Ticket } from 'lucide-react';

export default function Footer() {
  const copyrightYear = new Date().getFullYear();
  return (
    <footer className="bg-white py-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Ticket size={18} />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">CampusPass<span className="text-indigo-600">MRU</span></span>
        </div>
        <div className="flex gap-8">
          <a href="#" className="text-sm text-slate-500 hover:text-slate-900">Terms of Service</a>
          <a href="#" className="text-sm text-slate-500 hover:text-slate-900">Privacy Policy</a>
          <a href="#" className="text-sm text-slate-500 hover:text-slate-900">Contact Us</a>
        </div>
        <div className="text-slate-400 text-sm">&copy; {copyrightYear} CampusPass MRU. All rights reserved.</div>
      </div>
    </footer>
  );
}
