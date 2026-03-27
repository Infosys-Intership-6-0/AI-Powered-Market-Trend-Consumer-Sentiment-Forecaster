import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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

        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const endRadius = Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y)
        );

        const isDarkToLight = theme === 'dark';

        // Set reverse class for light→dark so CSS flips z-index
        if (!isDarkToLight) {
            document.documentElement.classList.add('theme-transition-reverse');
        } else {
            document.documentElement.classList.remove('theme-transition-reverse');
        }

        const transition = document.startViewTransition(() => {
            toggleTheme();
        });

        await transition.ready;

        if (isDarkToLight) {
            // Dark → Light: circle EXPANDS from button outward
            document.documentElement.animate(
                {
                    clipPath: [
                        `circle(0px at ${x}px ${y}px)`,
                        `circle(${endRadius}px at ${x}px ${y}px)`
                    ]
                },
                {
                    duration: 800,
                    easing: 'ease-out',
                    pseudoElement: '::view-transition-new(root)'
                }
            );
        } else {
            // Light → Dark: circle CONTRACTS back to button
            document.documentElement.animate(
                {
                    clipPath: [
                        `circle(${endRadius}px at ${x}px ${y}px)`,
                        `circle(0px at ${x}px ${y}px)`
                    ]
                },
                {
                    duration: 800,
                    easing: 'ease-in',
                    fill: 'forwards',
                    pseudoElement: '::view-transition-old(root)'
                }
            );
        }

        // Clean up the class after transition finishes
        await transition.finished;
        document.documentElement.classList.remove('theme-transition-reverse');
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
