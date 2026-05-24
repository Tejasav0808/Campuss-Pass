import { Ticket } from 'lucide-react';

export default function Footer() {
  const copyrightYear = new Date().getFullYear();
  return (
    <footer className="bg-white dark:bg-[#050014] transition-colors duration-300 py-12 border-t border-slate-100 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Ticket size={18} />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">CampusPass<span className="text-indigo-600">MRU</span></span>
        </div>
        <div className="flex gap-8">
          <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Contact Us</a>
        </div>
        <div className="text-slate-400 dark:text-slate-500 text-sm">&copy; {copyrightYear} CampusPass MRU. All rights reserved.</div>
      </div>
    </footer>
  );
}
