import "./login.css";

export default function Login() {
  return (
    <div className="min-h-screen bg-[#b9f36a] text-black font-['IBM_Plex_Mono',monospace] flex flex-col">
      {/* Header */}
      <header className="px-[60px] py-[40px] flex justify-between items-center">
        <div className="flex items-center gap-3 font-bold">
          <span className="w-8 h-8 bg-black block" />
          M. PARSER
        </div>

        <a
          href="#"
          className="text-[12px] font-semibold no-underline text-black"
        >
          SIGNUP ↗
        </a>
      </header>

      {/* Main */}
      <main className="flex-1 flex px-[60px] py-[40px] max-[900px]:flex-col">
        {/* Main */}
    
        {/* Left */}
        <section className="flex-1">
          <h1 className="text-[120px] leading-[0.9] font-extrabold m-0 max-[900px]:text-[72px]">
            LOG <br /> IN<span>.</span>
          </h1>

          <p className="text-[24px] font-bold mt-4">PARSE SMARTER.</p>
          <div className="mt-10 flex gap-4">
            <span className="w-1 bg-black" />
            <p className="max-w-[360px] text-[16px] leading-[1.6]">
              Create your account to upload marksheets, analyze results, and
              export structured data.
            </p>
          </div>
        </section>

        {/* Right */}
        <section className="flex-1 flex justify-center items-center max-[900px]:mt-10">
          <div className="bg-white border-[3px] border-black p-10 w-[420px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <label className="block text-[11px] font-bold tracking-wide mb-2">
              EMAIL ADDRESS
            </label>
            <input
              placeholder="you@example.com"
              className="w-full p-[14px] border-[3px] border-black text-[14px] mb-6 placeholder:text-[#999]"
            />

            <label className="block text-[11px] font-bold tracking-wide mb-2">
              PASSWORD
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-[14px] border-[3px] border-black text-[14px] mb-6 placeholder:text-[#999]"
            />

            <button className="w-full p-[18px] bg-black text-[#b9f36a] font-bold cursor-pointer">
              SUBMIT ↗
            </button>

            {/* Divider */}
            <div className="h-[2px] bg-black my-[30px]" />

            <p className="text-center text-[12px] font-semibold">
              DON'T HAVE AN ACCOUNT?{" "}
              <a href="#" className="underline">
                SIGNIN
              </a>
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-[60px] py-[30px] border-t-[3px] border-black  text-[11px] font-semibold flex justify-between">
        <div>© 2026 MARKSHEET PARSER</div>
        <div>
          <a href="">
            About Us
          </a>
        </div>
      </footer>
    </div>
  );
}
