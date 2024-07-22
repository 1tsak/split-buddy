// src/components/Walkthrough.js
import React, { useEffect } from 'react';
import introJs from 'intro.js';
import 'intro.js/introjs.css';

const Walkthrough = ({ runWalkthrough, onFinish }:any) => {
  useEffect(() => {
    if (runWalkthrough) {
      const intro = introJs();
      intro.setOptions({
        steps: [
            {
              intro: '<h2>Welcome to Split-Buddy!</h2><p>This walkthrough will guide you through the main features of our app.</p>',
            },
            {
              element: '.step1',
              intro: 'This is your dashboard, where you can get an overview of all your activities.',
            },
            {
              element: '.step2',
              intro: 'This is the sidebar. Use it to navigate through the different sections of the app effortlessly.',
            },
            {
              element: '.step3',
              intro: 'Here, you can view all your groups. Manage your groups and see the members involved.',
            },
            {
              element: '.step4',
              intro: 'Check out the latest notifications here. Stay updated with the most recent activities and updates.',
            },
            {
              element: '.step5',
              intro: 'In this section, you can easily split your expenses. Create new bills and manage your shared expenses.',
            },
            {
              element: '.step6',
              intro: 'Here, you can review your latest bill details.',
            },
            {
              element: '.step7',
              intro: 'This section shows your most recent transactions. Keep track of your expenses here.',
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
  }, [runWalkthrough, onFinish]);

  return null;
};

export default Walkthrough;
