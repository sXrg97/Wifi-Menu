import React from 'react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';

const steps = [
  {
    target: '.dashboard-title',
    content: 'Acesta este tabloul de bord, unde se fac toate modificările meniului.',
    disableBeacon: true,
  },
  {
    target: '.edit-menu-button',
    content: 'Aici poți edita detaliile meniului cum ar fi numele restaurantului, poza și numărul de mese.',
    disableBeacon: true,
  },
  {
    target: '.add-category-button',
    content: 'Apasă pe acest buton pentru a crea prima ta categorie de produse.',
    disableBeacon: true,
  },
];

const TourGuideDashboard = () => {
  const [run, setRun] = React.useState(true);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, action } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
    }
    // Prevent automatic progression on button clicks
    if (action === 'next' && data.index === 1) {
      // Check if the target element is visible
      const targetElement = document.querySelector('.add-category-button');
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      callback={handleJoyrideCallback}
      continuous
      locale={{
        back: 'Înapoi',
        next: 'Următorul',
        last: 'Finalizare',
        skip: 'Sari',
      }}
      showProgress
      showSkipButton
      styles={{
        options: {
          zIndex: 10000,
        },
      }}
    />
  );
};

export default TourGuideDashboard;