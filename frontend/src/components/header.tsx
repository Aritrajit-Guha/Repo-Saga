import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8 fixed top-0 w-full z-50 bg-transparent">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          {/* Large clean logo */}
          <Image
            src="/logo.png"
            alt="RepoSaga Logo"
            width={48}
            height={48}
            className="h-12 w-12 transition-transform duration-300 group-hover:scale-105"
          />

          {/* Brand text */}
          <div className="flex flex-col">
            <span className="text-3xl font-extrabold text-white tracking-wider">
              Repo<span className="text-primary">Saga</span>
            </span>
            <span className="text-xs text-primary/70 tracking-widest font-poppins">
              Version 0.1.0
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
