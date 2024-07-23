import React, { useEffect } from 'react';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import { useTranslation } from 'react-i18next';

const Walkthrough = ({ runWalkthrough, onFinish }: any) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (runWalkthrough) {
      const intro = introJs();
      intro.setOptions({
        steps: [
          {
            intro: `<h2>${t('walkthrough.welcomeTitle')}</h2><p>${t('walkthrough.welcomeDescription')}</p>`,
          },
          {
            element: '.step1',
            intro: t('walkthrough.dashboard'),
          },
          {
            element: '.step2',
            intro: t('walkthrough.sidebar'),
          },
          {
            element: '.step3',
            intro: t('walkthrough.groups'),
          },
          {
            element: '.step4',
            intro: t('walkthrough.notifications'),
          },
          {
            element: '.step5',
            intro: t('walkthrough.expenses'),
          },
          {
            element: '.step6',
            intro: t('walkthrough.billDetails'),
          },
          {
            element: '.step7',
            intro: t('walkthrough.transactions'),
          }
        ],
        showProgress: true,
        showBullets: false,
        exitOnEsc: true,
        exitOnOverlayClick: false,
        tooltipClass: 'custom-tooltip',
        highlightClass: 'custom-highlight',
        overlayOpacity: 0.5,
      });

      intro.oncomplete(onFinish);
      intro.onexit(onFinish);

      intro.start();
    }
  }, [runWalkthrough, onFinish, t]);

  return null;
};

export default Walkthrough;
