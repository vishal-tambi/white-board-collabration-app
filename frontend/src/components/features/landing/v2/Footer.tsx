import { Link } from 'react-router'
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

const footerLinks = {
    product: [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Changelog', href: '#changelog' },
        { name: 'Roadmap', href: '#roadmap' },
    ],
    resources: [
        { name: 'Documentation', href: '#docs' },
        { name: 'API Reference', href: '#api' },
        { name: 'Tutorials', href: '#tutorials' },
        { name: 'Blog', href: '#blog' },
    ],
    company: [
        { name: 'About', href: '#about' },
        { name: 'Careers', href: '#careers' },
        { name: 'Contact', href: '#contact' },
        { name: 'Press Kit', href: '#press' },
    ],
    legal: [
        { name: 'Privacy', href: '#privacy' },
        { name: 'Terms', href: '#terms' },
        { name: 'Cookies', href: '#cookies' },
    ],
}

const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
    { name: 'Email', icon: Mail, href: 'mailto:hello@whiteboard.app' },
]

export function Footer() {
    return (
        <footer className="relative bg-card border-t border-border">
            {/* Gradient accent */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="container mx-auto px-4 md:px-6 py-16">
                {/* Main footer content */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
                    {/* Brand column */}
                    <div className="col-span-2">
                        <Link to="/" className="inline-flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-lg">W</span>
                            </div>
                            <span className="font-bold text-xl text-foreground">Whiteboard</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-6">
                            The world's most advanced collaborative whiteboard. Built for teams who move fast and think visually.
                        </p>

                        {/* Social links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Product</h4>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Resources</h4>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Company</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Legal</h4>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Whiteboard. All rights reserved.
                    </p>

                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using React, TypeScript & Canvas API
                    </p>
                </div>
            </div>
        </footer>
    )
}
