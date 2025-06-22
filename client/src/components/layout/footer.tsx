import { Link } from "wouter";
import { LottieAnimation } from "@/components/ui/lottie-animation";
import animationData1 from "@/lib/lotties/X.json";
import animationData2 from "@/lib/lotties/fb.json";
import animationData3 from "@/lib/lotties/linkedin.json";

import footerImage from "@/lib/logos/AiiA Logo.png";

export default function Footer() {
  return (
    <footer className="border-t py-12 mt-24">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <img src={footerImage} alt="AiiA Logo" className="h-48" />
        </div>

        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2">
            <Link href="/about" className="text-sm hover:text-primary">
              About
            </Link>
            <Link href="/programs" className="text-sm hover:text-primary">
              Programs
            </Link>
            <Link href="/news" className="text-sm hover:text-primary">
              News
            </Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
          <div className="text-sm space-y-2">
            <p>Email: admin@aiinstituteafrica.com</p>
            <p>Phone: +263 78 266 4402</p>
            <p>Address: 275 Herbert Chitepo, Harare, Zimbabwe </p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Follow Us</h4>
          <div className="flex gap-4">
            <a
              href="https://x.com/aiinstituteafr?s=21&t=HWrqqLvw0iOr6jcLvBp2fQ"
              className="hover:text-primary w-8 h-8"
            >
              <LottieAnimation
                animationData={animationData1}
                className="w-full h-full"
              />
            </a>
            <a
              href="https://www.linkedin.com/company/aiinstituteafrica/"
              className="hover:text-primary w-8 h-8"
            >
              <LottieAnimation
                animationData={animationData3}
                className="w-full h-full"
              />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61565931200862"
              className="hover:text-primary w-8 h-8"
            >
              <LottieAnimation
                animationData={animationData2}
                className="w-full h-full"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="container mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} AI Institute Africa. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
