{/* User Actions */}
<div className="hidden lg:flex items-center gap-5">
  {/* Notification Bell */}
  <NotificationBell />

  {user ? (
    // লগইন থাকলে → ড্রপডাউন
    <div className="relative group">
      {/* Trigger Button */}
      <button className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-indigo-500/30 hover:border-indigo-400/50 hover:bg-gradient-to-r hover:from-indigo-600/20 hover:to-purple-600/20 transition-all duration-300 backdrop-blur-md shadow-lg shadow-black/40">
        <div className="relative">
          <img
            src={
              user?.photoURL ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "K")}?background=6366f1&color=fff`
            }
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40 ring-offset-2 ring-offset-[#0f172a]"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "K")}?background=6366f1&color=fff`;
            }}
          />
          {dbUser?.role === 'admin' && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center border-2 border-[#0f172a]">
              <ShieldCheck size={12} className="text-white" />
            </div>
          )}
        </div>

        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold text-white">
            {user?.displayName?.split(" ")[0] || "User"}
          </span>
          <span className="text-xs text-indigo-300/80">
            {dbUser?.role === 'admin' ? "Admin" : "Voyager"}
          </span>
        </div>

        <ChevronDown size={16} className="text-slate-400 group-hover:text-indigo-300 transition-colors" />
      </button>

      {/* Dropdown Menu */}
      <div className="absolute top-full right-0 mt-4 w-72 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 scale-95 group-hover:scale-100 origin-top-right z-[1001] overflow-hidden">
        {/* Profile Header */}
        <div className="p-5 border-b border-slate-700/70 bg-gradient-to-r from-indigo-950/30 to-purple-950/20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={
                  user?.photoURL ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "K")}?background=6366f1&color=fff`
                }
                alt="Profile"
                className="w-14 h-14 rounded-xl object-cover ring-2 ring-indigo-500/40"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "K")}?background=6366f1&color=fff`;
                }}
              />
              {dbUser?.role === 'admin' && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center border-2 border-[#0f172a]">
                  <ShieldCheck size={14} className="text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg text-white truncate">
                {user?.displayName || "User"}
              </p>
              <p className="text-sm text-slate-400 truncate">
                {user?.email || "Not logged in"}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-5 py-3.5 text-sm text-slate-300 hover:bg-indigo-600/20 hover:text-white transition-colors"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            to="/roadmap/generate"
            className="flex items-center gap-3 px-5 py-3.5 text-sm text-slate-300 hover:bg-indigo-600/20 hover:text-white transition-colors"
          >
            <Sparkles size={18} />
            Build Roadmap
          </Link>

          <Link
            to="/settings"
            className="flex items-center gap-3 px-5 py-3.5 text-sm text-slate-300 hover:bg-indigo-600/20 hover:text-white transition-colors"
          >
            <SettingsIcon size={18} />
            Settings
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3.5 text-sm text-red-400 hover:bg-red-600/20 hover:text-red-300 transition-colors border-t border-slate-700 mt-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  ) : (
    // লগইন না থাকলে → Login + Register
    <div className="flex items-center gap-4">
      <Link
        to="/login"
        className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg transition"
      >
        Register
      </Link>
    </div>
  )}
</div>