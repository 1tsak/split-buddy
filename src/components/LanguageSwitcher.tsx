import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, IconButton } from 'rsuite';
import { Globe2 } from 'react-bootstrap-icons';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Dropdown title="Language" icon={<Globe2 />} placement="bottomEnd">
      <Dropdown.Item onClick={() => changeLanguage('en')}>English</Dropdown.Item>
      <Dropdown.Item onClick={() => changeLanguage('hi')}>हिंदी</Dropdown.Item>
    </Dropdown>
  );
};

export default LanguageSwitcher;
