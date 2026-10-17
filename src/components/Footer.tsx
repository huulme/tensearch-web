import { useLocation } from 'preact-iso';

export function Footer() {
    const { url } = useLocation();

    return (
        <footer>
            <p class="text-center m-5">&copy; tensearch project | <a href="/">source code</a></p>
        </footer>
    );
}
