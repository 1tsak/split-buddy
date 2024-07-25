import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'rsuite';
import { Globe2 } from 'react-bootstrap-icons';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Determine the current language
  const currentLanguage = i18n.language;

  // Set the dropdown title based on the current language
  const getDropdownTitle = () => {
    switch (currentLanguage) {
      case 'en':
        return 'English';
      case 'hi':
        return 'हिंदी';
      default:
        return 'Language';
    }
  };

  return (
    <Dropdown title={getDropdownTitle()} icon={<Globe2 />} placement="bottomEnd">
      <Dropdown.Item onClick={() => changeLanguage('en')}>English</Dropdown.Item>
      <Dropdown.Item onClick={() => changeLanguage('hi')}>हिंदी</Dropdown.Item>
    </Dropdown>
  );
};

export default LanguageSwitcher;
