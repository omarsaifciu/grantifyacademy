import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import lightLogo from '@/assets/logo/lightmode.png';
import darkLogo from '@/assets/logo/darkmode.png';
import { t } from '@/lib/i18n';
import { DEFAULT_LOCALE, isRtlLocale, cn } from '@/lib/utils';
import LanguageSwitcher from '@/components/seo/LanguageSwitcher';

export const Footer = () => {
  const { locale } = useParams();
  const currentLocale = locale || DEFAULT_LOCALE;
  const rtl = isRtlLocale(currentLocale);
  return (
    <footer className="bg-secondary/40 border-t mt-20">
      <div className={cn('container mx-auto px-4 py-12', rtl ? 'text-right' : 'text-left')}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className={cn('flex items-center gap-3 mb-4', rtl ? 'flex-row-reverse' : 'flex-row')}>
              <div className="p-2 rounded-xl">
                <img src={lightLogo} alt="Logo" className="h-10 w-auto block dark:hidden" />
                <img src={darkLogo} alt="Logo" className="h-10 w-auto hidden dark:block" />
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              {t(currentLocale, 'footer_tagline')}
            </p>
            <div className={cn('flex gap-3', rtl ? 'flex-row-reverse' : '')}>
              <a href="#" className="p-2 bg-secondary rounded-lg hover:bg-accent transition-colors">
                <Facebook className="w-5 h-5 text-primary" />
              </a>
              <a href="#" className="p-2 bg-secondary rounded-lg hover:bg-accent transition-colors">
                <Twitter className="w-5 h-5 text-primary" />
              </a>
              <a href="#" className="p-2 bg-secondary rounded-lg hover:bg-accent transition-colors">
                <Instagram className="w-5 h-5 text-primary" />
              </a>
              <a href="#" className="p-2 bg-secondary rounded-lg hover:bg-accent transition-colors">
                <Linkedin className="w-5 h-5 text-primary" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-foreground">{t(currentLocale, 'footer_quick_links')}</h3>
            <ul className={cn('space-y-2', rtl ? 'text-right' : 'text-left')}>
              <li>
                <Link to={`/${currentLocale}/`} className="text-muted-foreground hover:text-primary transition-colors">
                  {t(currentLocale, 'nav_home')}
                </Link>
              </li>
              <li>
                <Link to={`/${currentLocale}/universities`} className="text-muted-foreground hover:text-primary transition-colors">
                  {t(currentLocale, 'nav_universities')}
                </Link>
              </li>
              <li>
                <Link to={`/${currentLocale}/scholarships`} className="text-muted-foreground hover:text-primary transition-colors">
                  {t(currentLocale, 'nav_scholarships')}
                </Link>
              </li>
              <li>
                <Link to={`/${currentLocale}/blog`} className="text-muted-foreground hover:text-primary transition-colors">
                  {t(currentLocale, 'nav_blog')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-foreground">{t(currentLocale, 'footer_services')}</h3>
            <ul className={cn('space-y-2', rtl ? 'text-right' : 'text-left')}>
              <li className="text-muted-foreground">{t(currentLocale, 'service_consulting')}</li>
              <li className="text-muted-foreground">{t(currentLocale, 'service_application_help')}</li>
              <li className="text-muted-foreground">{t(currentLocale, 'service_translation')}</li>
              <li className="text-muted-foreground">{t(currentLocale, 'service_support')}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-foreground">{t(currentLocale, 'footer_contact_us')}</h3>
            <ul className={cn('space-y-3', rtl ? 'text-right' : 'text-left')}>
              <li className={cn('flex items-center gap-2 text-muted-foreground', rtl ? 'flex-row-reverse' : '')}>
                <Mail className="w-5 h-5 text-primary" />
                <span>info@scholarships.com</span>
              </li>
              <li className={cn('flex items-center gap-2 text-muted-foreground', rtl ? 'flex-row-reverse' : '')}>
                <Phone className="w-5 h-5 text-primary" />
                <span>+90 123 456 7890</span>
              </li>
              <li className={cn('flex items-center gap-2 text-muted-foreground', rtl ? 'flex-row-reverse' : '')}>
                <MapPin className="w-5 h-5 text-primary" />
                <span>نيقوسيا</span>
              </li>
            </ul>
          </div>
          <div>
            <LanguageSwitcher variant="footer" />
          </div>
        </div>

        <div className="border-t pt-8 text-center">
          <p className="text-muted-foreground">
            {t(currentLocale, 'footer_copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};