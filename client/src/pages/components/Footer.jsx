import { Link } from "react-router-dom";
import { FaPhone, FaEnvelope, FaInstagram, FaWhatsapp, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white mt-10">
      <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-extrabold tracking-tight">GoTour</span>
          </div>
          <div className="text-sm">
            <p className="font-semibold">Head Office:</p>
            <p>GoTour HQ, 107 X Road, Mahalakshmi Nagar</p>
            <p>Mothe, Jagtial, Telangana 505327</p>
          </div>
          <div className="text-sm mt-2">
            <p className="font-semibold">Branch Offices:</p>
            <p>Hyderabad: 4th Floor, JQ Chambers, Gachibowli, Hyderabad 500032</p>
            <p>Siddipet: 1-82/2, Opposite Vishal Mart, Siddipet 502103</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-semibold">Travel Packages</p>
          <Link className="hover:underline" to="/domestic">Domestic Tours</Link>
          <Link className="hover:underline" to="/international">International Tours</Link>
          <Link className="hover:underline" to="/group-tours">Group Packages</Link>
          <Link className="hover:underline" to="/honeymoon">Honeymoon Packages</Link>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-semibold">Contact</p>
          <a className="flex items-center gap-2 hover:underline" href="tel:+919000847111"><FaPhone /> +91 9000 847 111</a>
          <a className="flex items-center gap-2 hover:underline" href="tel:+919000847222"><FaPhone /> +91 9000 847 222</a>
          <a className="flex items-center gap-2 hover:underline" href="mailto:support@gotour.in"><FaEnvelope /> support@gotour.in</a>
          <div className="mt-2">
            <p className="font-semibold">Follow Us</p>
            <div className="flex items-center gap-3 mt-1">
              <a className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20" href="#" aria-label="instagram"><FaInstagram /></a>
              <a className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20" href="#" aria-label="whatsapp"><FaWhatsapp /></a>
              <a className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20" href="#" aria-label="facebook"><FaFacebook /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between text-sm">
          <span>© {new Date().getFullYear()} GoTour. All rights reserved.</span>
          <span>
            Made with <span className="text-red-500">❤</span> for travelers worldwide
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
