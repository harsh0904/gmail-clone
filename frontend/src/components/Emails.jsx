import React, { useEffect, useState } from 'react'
import Email from './Email'
import useGetAllEmails from '../hooks/useGetAllEmails'
import { useSelector } from 'react-redux';

const Emails = () => {
  useGetAllEmails();
  const { emails, sentEmails, searchText, activeTab } = useSelector(store => store.app);

  const currentEmails = activeTab === 'sent' ? sentEmails : emails;

  const [filterEmail, setFilterEmail] = useState(currentEmails);

  useEffect(() => {
    const filteredEmail = currentEmails.filter((email) => {
      return (
        email?.subject?.toLowerCase().includes(searchText.toLowerCase()) ||
        email?.to?.toLowerCase().includes(searchText.toLowerCase()) ||
        email?.from?.toLowerCase().includes(searchText.toLowerCase()) ||
        email?.message?.toLowerCase().includes(searchText.toLowerCase())
      );
    });
    setFilterEmail(filteredEmail);
  }, [searchText, emails, sentEmails, activeTab])

  if (filterEmail.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-gray-400'>
        <span className='text-5xl mb-4'>
          {activeTab === 'sent' ? '📤' : '📭'}
        </span>
        <p className='text-lg font-medium'>
          {activeTab === 'sent' ? 'No sent messages' : 'Your inbox is empty'}
        </p>
        <p className='text-sm mt-1'>
          {activeTab === 'sent' ? 'Emails you send will appear here' : 'Emails sent to you will appear here'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {filterEmail && filterEmail?.map((email) => <Email key={email._id} email={email} />)}
    </div>
  )
}

export default Emails