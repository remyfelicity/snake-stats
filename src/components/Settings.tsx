import {
  Field,
  Popover,
  PopoverButton,
  PopoverPanel,
  Radio,
  RadioGroup,
} from "@headlessui/react";
import {
  Cog6ToothIcon,
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

const themes = [
  {
    name: "Light",
    value: "light",
    icon: SunIcon,
  },
  {
    name: "Dark",
    value: "dark",
    icon: MoonIcon,
  },
  {
    name: "Device",
    value: "device",
    icon: ComputerDesktopIcon,
  },
] as const;

export function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "device");

  useEffect(() => {
    const deviceThemeIsDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    if (theme === "dark" || (theme === "device" && deviceThemeIsDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Popover className="relative">
      <PopoverButton className="flex h-12 cursor-pointer items-center gap-2 rounded-full px-4 transition duration-200 hover:bg-zinc-200 dark:hover:bg-zinc-800">
        <Cog6ToothIcon className="size-5" />
        <span className="sr-only font-medium md:not-sr-only">Settings</span>
      </PopoverButton>
      <PopoverPanel
        anchor="bottom end"
        className="origin-top-right p-2 transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
        transition
      >
        <div className="rounded-xl border border-zinc-300 bg-zinc-100 p-4 shadow dark:border-none dark:bg-zinc-800">
          <label className="font-medium" htmlFor="theme-radio">
            Theme
          </label>
          <RadioGroup
            className="mt-2 grid auto-cols-fr grid-flow-col gap-1 rounded-full bg-zinc-200 p-1 dark:bg-zinc-700"
            id="theme-radio"
            onChange={setTheme}
            value={theme}
          >
            {themes.map((theme) => (
              <Field key={theme.value}>
                <Radio
                  className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full px-4 transition duration-200 hover:bg-zinc-300 data-checked:bg-zinc-100 dark:hover:bg-zinc-600 dark:data-checked:bg-zinc-800"
                  value={theme.value}
                >
                  <theme.icon className="size-5" />
                  {theme.name}
                </Radio>
              </Field>
            ))}
          </RadioGroup>
        </div>
      </PopoverPanel>
    </Popover>
  );
}
