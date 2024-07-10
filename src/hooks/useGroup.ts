import { useContext } from 'react';
import { GroupContext } from '../context/GroupProvider';
import { GroupContextType } from '../utils/types';

const useGroup = (): GroupContextType => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error('useGroup must be used within a GroupProvider');
  }
  return context;
};

export default useGroup;