import { FC } from 'react';
import { MdAttachMoney } from 'react-icons/md';
import { TransactionCardType } from '../../types/types';
import { useTranslation } from 'react-i18next';

interface ITransactionCardProps {
  data: TransactionCardType;
}

const TransactionCard: FC<ITransactionCardProps> = ({ data }) => {
  const { amount, isGetting } = data;
  const { t } = useTranslation(); // Add translation hook

  return (
    <div className='flex gap-2 p-2 items-center'> 
      <div className={`rounded-lg overflow-hidden p-2 ${isGetting ? 'bg-green-400' : 'bg-red-400'} `}>
        <MdAttachMoney className='text-white text-lg font-bolder'/>
      </div>
      <div className='flex-grow flex justify-start items-start flex-col '>
        <p className='font-bold'>{isGetting ? t('transaction.received') : t('transaction.sent')}</p>
        {/* <p className='text-[12px] text-gray-400 font-thin'>{isGetting ? t("transaction.by") : t("transaction.to")}{data.userName}</p> */}
      </div>
      <div >
        <p className={isGetting ? 'text-green-500 text-start' : 'text-red-500 text-start'}>
          {isGetting ? '' : '-'}₹{amount}
        </p>
      </div>
    </div>
  )
}

export default TransactionCard;
