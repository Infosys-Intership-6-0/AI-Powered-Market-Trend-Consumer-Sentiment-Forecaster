import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';

const ThemeToggler = () => {
    const { theme, toggleTheme } = useTheme();

    const handleToggle = async (e) => {
        // Fallback for browsers that don't support View Transitions
        if (!document.startViewTransition) {
            toggleTheme();
            return;
        }

        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();

        // Calculate center of the button
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Calculate radius to cover the furthest corner of the screen
        const endRadius = Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y)
        );

        const transition = document.startViewTransition(() => {
            toggleTheme();
        });

        await transition.ready;

        // Animate the clip-path
        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${endRadius}px at ${x}px ${y}px)`
                ]
            },
            {
                duration: 1000,
                easing: 'ease-out',
                pseudoElement: '::view-transition-new(root)'
            }
        );
    };

    return (
        <button
            onClick={handleToggle}
            className="p-2 rounded-full transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
            aria-label="Toggle Theme"
        >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
};

export default ThemeToggler;
