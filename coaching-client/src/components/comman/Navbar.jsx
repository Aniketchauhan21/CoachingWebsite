import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from 'react-icons/io';
import { useAuth } from '../../context/AuthContext';
import dclogo from '../../assets/images/dclogo.png';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const { user, logout, isStudent, isAdmin, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) {
                setIsMobileMenuOpen(false);
                setActiveDropdown(null);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setActiveDropdown(null);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
    };

    const toggleMobileDropdown = (dropdownName) => {
        if (isMobile) {
            setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
        }
    };

    const handleDropdownClick = (e, dropdownName) => {
        if (isMobile) {
            e.preventDefault();
            toggleMobileDropdown(dropdownName);
        } else {
            closeMobileMenu();
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        closeMobileMenu();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobileMenuOpen && !event.target.closest('.navbar')) {
                closeMobileMenu();
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMobileMenuOpen]);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    if (isLoading) return null;

    return (
        <nav className="navbar fixed top-0 w-full z-50 bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 lg:h-20">
                    {/* Logo */}
                    <Link 
                        to="/" 
                        className="flex-shrink-0 transition-transform duration-300 hover:scale-105"
                        onClick={closeMobileMenu}
                    >
                        <img 
                            src={dclogo} 
                            alt="CoachingHub Logo" 
                            className="h-12 lg:h-14 w-auto transition-all duration-300 hover:brightness-110" 
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex lg:items-center lg:space-x-1">
                        {/* Home */}
                        <Link 
                            to="/" 
                            className="relative px-4 py-2 text-gray-800 font-medium text-sm xl:text-base rounded-full transition-all duration-300 group"
                            style={{ }}
                        >
                            Home
                            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-3/4 transform -translate-x-1/2"
                                style={{backgroundColor: '#eda835'}}
                            ></span>
                        </Link>

                        {/* About Dropdown */}
                        <div className="relative group">
                            <Link 
                                to="#" 
                                className="flex items-center px-4 py-2 text-gray-800 font-medium text-sm xl:text-base rounded-full transition-all duration-300 group"
                                style={{ }}
                                onClick={(e) => handleDropdownClick(e, 'about')}
                            >
                                About
                                <IoIosArrowDown className="ml-1 text-xs transition-transform duration-300 group-hover:rotate-180" />
                            </Link>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-gray-100 py-2 min-w-48">
                                    <Link 
                                        to="/about/institute" 
                                        className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 hover:translate-x-1"
                                        onClick={closeMobileMenu}
                                    >
                                        About Institute
                                    </Link>
                                    <Link 
                                        to="/about/directors-desk" 
                                        className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 hover:translate-x-1"
                                        onClick={closeMobileMenu}
                                    >
                                        Director's Desk
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Courses Dropdown */}
                        <div className="relative group">
                            <Link 
                                to="/courses" 
                                className="flex items-center px-4 py-2 text-gray-800 font-medium text-sm xl:text-base rounded-full transition-all duration-300 group"
                                style={{ }}
                                onClick={(e) => handleDropdownClick(e, 'courses')}
                            >
                                Courses
                                <IoIosArrowDown className="ml-1 text-xs transition-transform duration-300 group-hover:rotate-180" />
                            </Link>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-gray-100 py-2 min-w-48">
                                    <Link 
                                        to="/courses/spoken-english" 
                                        className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 hover:translate-x-1"
                                        onClick={closeMobileMenu}
                                    >
                                        Spoken English
                                    </Link>
                                    <Link 
                                        to="/courses/communication-skills" 
                                        className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 hover:translate-x-1"
                                        onClick={closeMobileMenu}
                                    >
                                        Communication Skills
                                    </Link>
                                    <Link 
                                        to="/courses/ielts-preparation" 
                                        className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 hover:translate-x-1"
                                        onClick={closeMobileMenu}
                                    >
                                        IELTS Preparation
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Blog Dropdown */}
                        <div className="relative group">
                            <Link 
                                to="/blog" 
                                className="flex items-center px-4 py-2 text-gray-800 font-medium text-sm xl:text-base rounded-full transition-all duration-300 group"
                                style={{ }}
                                onClick={(e) => handleDropdownClick(e, 'blog')}
                            >
                                Blog
                                <IoIosArrowDown className="ml-1 text-xs transition-transform duration-300 group-hover:rotate-180" />
                            </Link>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-gray-100 py-2 min-w-48">
                                    <Link 
                                        to="/blog/study-tips" 
                                        className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 hover:translate-x-1"
                                        onClick={closeMobileMenu}
                                    >
                                        Study Tips
                                    </Link>
                                    <Link 
                                        to="/blog/exam-strategies" 
                                        className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 hover:translate-x-1"
                                        onClick={closeMobileMenu}
                                    >
                                        Exam Strategies
                                    </Link>
                                    <Link 
                                        to="/blog/success-stories" 
                                        className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 hover:translate-x-1"
                                        onClick={closeMobileMenu}
                                    >
                                        Success Stories
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Services */}
                        <Link 
                            to="/services" 
                            className="relative px-4 py-2 text-gray-800 font-medium text-sm xl:text-base rounded-full transition-all duration-300 group"
                            style={{ }}
                        >
                            Services
                            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-3/4 transform -translate-x-1/2"
                                style={{backgroundColor: '#eda835'}}
                            ></span>
                        </Link>

                        {/* Contact */}
                        <Link 
                            to="/contact" 
                            className="relative px-4 py-2 text-gray-800 font-medium text-sm xl:text-base rounded-full transition-all duration-300 group"
                            style={{ }}
                        >
                            Contact
                            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-3/4 transform -translate-x-1/2"
                                style={{backgroundColor: '#eda835'}}
                            ></span>
                        </Link>

                        {/* Auth Section */}
                        {!user && (
                            <div className="relative group ml-2">
                                <Link 
                                    to="#" 
                                    className="flex items-center px-4 py-2 text-white font-medium text-sm xl:text-base rounded-full transition-all duration-300 group"
                                    style={{
                                        background: 'linear-gradient(to right, #1976d2, #1565c0)'
                                    }}
                                    onClick={(e) => handleDropdownClick(e, 'login-register')}
                                >
                                    Login/Register
                                    <IoIosArrowDown className="ml-1 text-xs transition-transform duration-300 group-hover:rotate-180" />
                                </Link>
                                <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                    <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-gray-100 py-2 min-w-44">
                                        <Link 
                                            to="/student/login" 
                                            className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                            onClick={closeMobileMenu}
                                        >
                                            Student Login
                                        </Link>
                                        <Link 
                                            to="/student/register" 
                                            className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                            onClick={closeMobileMenu}
                                        >
                                            Student Register
                                        </Link>
                                        <Link 
                                            to="/admin/login" 
                                            className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                            onClick={closeMobileMenu}
                                        >
                                            Admin Login
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isStudent && (
                            <div className="relative group ml-2">
                                <Link 
                                    to="#" 
                                    className="flex items-center px-4 py-2 text-white font-medium text-sm xl:text-base rounded-full transition-all duration-300 group"
                                    style={{
                                        background: 'linear-gradient(to right, #eda835, #e09e2f)'
                                    }}
                                    onClick={(e) => handleDropdownClick(e, 'student-account')}
                                >
                                    My Account
                                    <IoIosArrowDown className="ml-1 text-xs transition-transform duration-300 group-hover:rotate-180" />
                                </Link>
                                <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                    <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-gray-100 py-2 min-w-44">
                                        <Link 
                                            to="/student/dashboard" 
                                            className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                            onClick={closeMobileMenu}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link 
                                            to="/student/profile" 
                                            className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                            onClick={closeMobileMenu}
                                        >
                                            Profile
                                        </Link>
                                        <Link 
                                            to="/student/my-courses" 
                                            className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                            onClick={closeMobileMenu}
                                        >
                                            My Courses
                                        </Link>
                                        <button 
                                            onClick={handleLogout} 
                                            className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isAdmin && (
                            <div className="relative group ml-2">
                                <Link 
                                    to="#" 
                                    className="flex items-center px-4 py-2 text-white font-medium text-sm xl:text-base rounded-full transition-all duration-300 group"
                                    style={{
                                        background: 'linear-gradient(to right, #7c3aed, #5b21b6)'
                                    }}
                                    onClick={(e) => handleDropdownClick(e, 'admin-panel')}
                                >
                                    Admin Panel
                                    <IoIosArrowDown className="ml-1 text-xs transition-transform duration-300 group-hover:rotate-180" />
                                </Link>
                                <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                    <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-gray-100 py-2 min-w-48">
                                        <Link 
                                            to="/admin/dashboard" 
                                            className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                            onClick={closeMobileMenu}
                                        >
                                            Admin Dashboard
                                        </Link>
                                        <Link 
                                            to="/admin/manage-courses" 
                                            className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                            onClick={closeMobileMenu}
                                        >
                                            Manage Courses
                                        </Link>
                                        <button 
                                            onClick={handleLogout} 
                                            className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="lg:hidden relative w-10 h-10 flex flex-col justify-center items-center space-y-1 focus:outline-none"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle mobile menu"
                    >
                        <span className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                        <span className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-0' : ''}`}></span>
                        <span className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`lg:hidden fixed inset-x-0 top-16 bg-white/95 backdrop-blur-lg shadow-xl border-t border-gray-100 transition-all duration-300 z-40 ${isMobileMenuOpen ? 'max-h-screen opacity-100 visible' : 'max-h-0 opacity-0 invisible overflow-hidden'}`}>
                <div className="px-4 py-2 space-y-1">
                    {/* Mobile Home */}
                    <Link 
                        to="/" 
                        className="block px-4 py-3 text-gray-800 font-medium border-b border-gray-100 transition-all duration-200"
                        style={{ }}
                        onClick={closeMobileMenu}
                        onMouseOver={e => e.currentTarget.style.color='#eda835'}
                        onMouseOut={e => e.currentTarget.style.color=''}
                    >
                        Home
                    </Link>

                    {/* Mobile About Dropdown */}
                    <div>
                        <button 
                            className="w-full flex items-center justify-between px-4 py-3 text-gray-800 font-medium border-b border-gray-100 transition-all duration-200"
                            style={{ }}
                            onClick={(e) => handleDropdownClick(e, 'about')}
                            onMouseOver={e => e.currentTarget.style.color='#eda835'}
                            onMouseOut={e => e.currentTarget.style.color=''}
                        >
                            About
                            <IoIosArrowDown className={`text-sm transition-transform duration-300 ${activeDropdown === 'about' ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${activeDropdown === 'about' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="bg-gray-50/80 py-2">
                                <Link 
                                    to="/about/institute" 
                                    className="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                    onClick={closeMobileMenu}
                                >
                                    About Institute
                                </Link>
                                <Link 
                                    to="/about/directors-desk" 
                                    className="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                    onClick={closeMobileMenu}
                                >
                                    Director's Desk
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Courses Dropdown */}
                    <div>
                        <button 
                            className="w-full flex items-center justify-between px-4 py-3 text-gray-800 font-medium border-b border-gray-100 transition-all duration-200"
                            style={{ }}
                            onClick={(e) => handleDropdownClick(e, 'courses')}
                            onMouseOver={e => e.currentTarget.style.color='#eda835'}
                            onMouseOut={e => e.currentTarget.style.color=''}
                        >
                            Courses
                            <IoIosArrowDown className={`text-sm transition-transform duration-300 ${activeDropdown === 'courses' ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${activeDropdown === 'courses' ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="bg-gray-50/80 py-2">
                                <Link 
                                    to="/courses/spoken-english" 
                                    className="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                    onClick={closeMobileMenu}
                                >
                                    Spoken English
                                </Link>
                                <Link 
                                    to="/courses/communication-skills" 
                                    className="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                    onClick={closeMobileMenu}
                                >
                                    Communication Skills
                                </Link>
                                <Link 
                                    to="/courses/ielts-preparation" 
                                    className="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                    onClick={closeMobileMenu}
                                >
                                    IELTS Preparation
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Blog Dropdown */}
                    <div>
                        <button 
                            className="w-full flex items-center justify-between px-4 py-3 text-gray-800 font-medium border-b border-gray-100 transition-all duration-200"
                            style={{ }}
                            onClick={(e) => handleDropdownClick(e, 'blog')}
                            onMouseOver={e => e.currentTarget.style.color='#eda835'}
                            onMouseOut={e => e.currentTarget.style.color=''}
                        >
                            Blog
                            <IoIosArrowDown className={`text-sm transition-transform duration-300 ${activeDropdown === 'blog' ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${activeDropdown === 'blog' ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="bg-gray-50/80 py-2">
                                <Link 
                                    to="/blog/study-tips" 
                                    className="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                    onClick={closeMobileMenu}
                                >
                                    Study Tips
                                </Link>
                                <Link 
                                    to="/blog/exam-strategies" 
                                    className="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                    onClick={closeMobileMenu}
                                >
                                    Exam Strategies
                                </Link>
                                <Link 
                                    to="/blog/success-stories" 
                                    className="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                    onClick={closeMobileMenu}
                                >
                                    Success Stories
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Services */}
                    <Link 
                        to="/services" 
                        className="block px-4 py-3 text-gray-800 font-medium border-b border-gray-100 transition-all duration-200"
                        style={{ }}
                        onClick={closeMobileMenu}
                        onMouseOver={e => e.currentTarget.style.color='#eda835'}
                        onMouseOut={e => e.currentTarget.style.color=''}
                    >
                        Services
                    </Link>

                    {/* Mobile Contact */}
                    <Link 
                        to="/contact" 
                        className="block px-4 py-3 text-gray-800 font-medium border-b border-gray-100 transition-all duration-200"
                        style={{ }}
                        onClick={closeMobileMenu}
                        onMouseOver={e => e.currentTarget.style.color='#eda835'}
                        onMouseOut={e => e.currentTarget.style.color=''}
                    >
                        Contact
                    </Link>

                    {/* Mobile Auth Section */}
                    {!user && (
                        <div>
                            <button 
                                className="w-full flex items-center justify-between px-4 py-3 text-white font-medium rounded-lg mt-2 transition-all duration-200"
                                style={{
                                    background: 'linear-gradient(to right, #1976d2, #1565c0)'
                                }}
                                onClick={(e) => handleDropdownClick(e, 'login-register')}
                            >
                                Login/Register
                                <IoIosArrowDown className={`text-sm transition-transform duration-300 ${activeDropdown === 'login-register' ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${activeDropdown === 'login-register' ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="bg-gray-50/80 py-2 rounded-b-lg">
                                    <Link 
                                        to="/student/login" 
                                        className="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                        onClick={closeMobileMenu}
                                    >
                                        Student Login
                                    </Link>
                                    <Link 
                                        to="/student/register" 
                                        className="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                        onClick={closeMobileMenu}
                                    >
                                        Student Register
                                    </Link>
                                    <Link 
                                        to="/admin/login" 
                                        className="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                        onClick={closeMobileMenu}
                                    >
                                        Admin Login
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {isStudent && (
                        <div>
                            <button 
                                className="w-full flex items-center justify-between px-4 py-3 text-white font-medium rounded-lg mt-2 transition-all duration-200"
                                style={{
                                    background: 'linear-gradient(to right, #eda835, #e09e2f)'
                                }}
                                onClick={(e) => handleDropdownClick(e, 'student-account')}
                            >
                                My Account
                                <IoIosArrowDown className={`text-sm transition-transform duration-300 ${activeDropdown === 'student-account' ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${activeDropdown === 'student-account' ? 'max-h-56 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="bg-gray-50/80 py-2 rounded-b-lg">
                                    <Link 
                                        to="/student/dashboard" 
                                        className="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                        onClick={closeMobileMenu}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link 
                                        to="/student/profile" 
                                        className="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                        onClick={closeMobileMenu}
                                    >
                                        Profile
                                    </Link>
                                    <Link 
                                        to="/student/my-courses" 
                                        className="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                        onClick={closeMobileMenu}
                                    >
                                        My Courses
                                    </Link>
                                    <button 
                                        onClick={handleLogout}
                                        className="block w-full text-left px-8 py-2 text-red-600 hover:bg-red-50 transition-all duration-200"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isAdmin && (
                        <div>
                            <button 
                                className="w-full flex items-center justify-between px-4 py-3 text-white font-medium rounded-lg mt-2 transition-all duration-200"
                                style={{
                                    background: 'linear-gradient(to right, #7c3aed, #5b21b6)'
                                }}
                                onClick={(e) => handleDropdownClick(e, 'admin-panel')}
                            >
                                Admin Panel
                                <IoIosArrowDown className={`text-sm transition-transform duration-300 ${activeDropdown === 'admin-panel' ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${activeDropdown === 'admin-panel' ? 'max-h-56 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="bg-gray-50/80 py-2 rounded-b-lg">
                                    <Link 
                                        to="/admin/dashboard" 
                                        className="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                        onClick={closeMobileMenu}
                                    >
                                        Admin Dashboard
                                    </Link>
                                    <Link 
                                        to="/admin/manage-courses" 
                                        className="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                        onClick={closeMobileMenu}
                                    >
                                        Manage Courses
                                    </Link>
                                    <button 
                                        onClick={handleLogout}
                                        className="block w-full text-left px-8 py-2 text-red-600 hover:bg-red-50 transition-all duration-200"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </nav>
    );
};

export default Navbar;