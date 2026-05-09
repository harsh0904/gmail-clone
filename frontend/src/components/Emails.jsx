import React, { useEffect, useState } from 'react'
import Email from './Email'
import Draft from './Draft'
import useGetAllEmails from '../hooks/useGetAllEmails'
import { useSelector } from 'react-redux';

const TAB_CONFIG = {
  inbox:   { emoji: '📭', empty: 'Your inbox is empty',     sub: 'Emails sent to you will appear here' },
  sent:    { emoji: '📤', empty: 'No sent messages',        sub: 'Emails you send will appear here' },
  starred: { emoji: '⭐', empty: 'No starred messages',     sub: 'Star emails to find them quickly later' },
  snoozed: { emoji: '⏰', empty: 'No snoozed messages',     sub: 'Hover an email and click the clock to snooze it' },
  drafts:  { emoji: '📝', empty: 'No drafts',               sub: 'Start composing to save a draft automatically' },
  more:    { emoji: '📂', empty: 'Nothing here yet',        sub: '' },
};

const Emails = () => {
  useGetAllEmails();
  const { emails, sentEmails, starredEmails, snoozedEmails, drafts, searchText, activeTab } = useSelector(store => store.app);

  const getBaseEmails = () => {
    switch (activeTab) {
      case 'sent':    return sentEmails;
      case 'starred': return starredEmails;
      case 'snoozed': return snoozedEmails;
      case 'drafts':  return drafts;
      case 'inbox':
      default:        return emails;
    }
  };

  const [filterEmail, setFilterEmail] = useState([]);

  useEffect(() => {
    const base = getBaseEmails();
    const filtered = base.filter((email) => {
      const q = searchText.toLowerCase();
      return (
        email?.subject?.toLowerCase().includes(q) ||
        email?.to?.toLowerCase().includes(q) ||
        email?.from?.toLowerCase().includes(q) ||
        email?.message?.toLowerCase().includes(q)
      );
    });
    setFilterEmail(filtered);
  }, [searchText, emails, sentEmails, starredEmails, snoozedEmails, drafts, activeTab]);

  const cfg = TAB_CONFIG[activeTab] || TAB_CONFIG.inbox;

  if (filterEmail.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-gray-400'>
        <span className='text-5xl mb-4'>{cfg.emoji}</span>
        <p className='text-lg font-medium'>{cfg.empty}</p>
        {cfg.sub && <p className='text-sm mt-1'>{cfg.sub}</p>}
      </div>
    );
  }

  if (activeTab === 'drafts') {
    return (
      <div>
        {filterEmail.map((draft) => <Draft key={draft._id} draft={draft} />)}
      </div>
    );
  }

  return (
    <div>
      {filterEmail.map((email) => <Email key={email._id} email={email} />)}
    </div>
  )
}

export default Emails