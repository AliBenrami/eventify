import { useEffect, useRef, useState } from "react";

const Menu = () => {
  const [firstLoad, setFirstLoad] = useState(true);
  const [open, setOpen] = useState(false);
  const [opening, setOpening] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        open
      ) {
        setOpen(false);
      }
    };

    if (open) {
      if (!firstLoad) {
        setOpening(true);
        setTimeout(() => {
          setOpening(false);
          document.addEventListener("mousedown", handleClickOutside);
        }, 600); // Wait until animation completes before adding listener
      } else {
        setFirstLoad(false);
        document.addEventListener("mousedown", handleClickOutside);
      }
    } else {
      if (!firstLoad) {
        setOpening(true);
        setTimeout(() => setOpening(false), 600);
      }
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleToggle = () => {
    if (!opening) {
      setOpen((prev) => !prev);
      setOpening(true);
      setTimeout(() => setOpening(false), 600);
    }
  };

  const MenuButton = () => (
    <div className="fixed left-0 top-0 translate-[50px]">
      <button
        className="w-10 h-10 bg-amber-300 rounded-md"
        onClick={handleToggle}
        disabled={opening}
      >
        <div className="flex flex-col gap-2 w-full h-full justify-center items-center">
          <div className="w-7 h-[2px] bg-amber-50"></div>
          <div className="w-7 h-[2px] bg-amber-50"></div>
          <div className="w-7 h-[2px] bg-amber-50"></div>
        </div>
      </button>
    </div>
  );

  const MenuUI = () => (
    <div
      ref={menuRef}
      className={`absolute left-[0] top-0 w-[150px] h-dvh flex flex-col items-center pt-30 gap-5 shadow-lg bg-gray-700 translate-x-[-100%]
        ${
          opening
            ? open
              ? " translate-x-[0%] animate-slideIn"
              : " translate-x-[0%] animate-slideOut"
            : open
            ? "translate-x-[0%]"
            : "translate-x-[-50%]"
        }`}
    >
      <button
        ref={firstButtonRef}
        className="w-3/4 p-2 bg-gray-600 text-white rounded-md"
      >
        Settings
      </button>
      <button
        className="w-3/4 p-2 bg-red-500 text-white rounded-md"
        onClick={handleToggle}
      >
        Logout
      </button>
    </div>
  );

  return (
    <>
      <MenuUI />
      <MenuButton />
    </>
  );
};

export default Menu;
