import { db } from '@/utils/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import React from 'react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';

const steps = [
  {
    target: '.add-product-button',
    content: 'Apasă pe acest buton pentru a crea primul tău produs.',
    disableBeacon: true,
  },
]

const TourGuideAddProduct = ({menuId}: {menuId:string}) => {
  const [run, setRun] = React.useState(true);

  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { status, action } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);

      try {
        const menuRef = doc(db, 'menus', menuId); // Adjust the collection name as needed
        await updateDoc(menuRef, {
          hasFinishedTutorial: true,
        });
        console.log('Tutorial completion status updated in Firebase.');
      } catch (error) {
        console.error('Error updating tutorial status:', error);
      }
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

export default TourGuideAddProduct;