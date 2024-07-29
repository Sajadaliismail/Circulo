import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';

const AvatarWithUsername = ({
  username,
  subTitle,
  hiddenName = false,
  ...props
}) => {
  const [title, setTitle] = useState('');
  const [secondaryTitle, setSecondaryTitle] = useState('');

  useEffect(() => {
    setTitle(username);
  }, [username]);

  useEffect(() => {
    setSecondaryTitle(subTitle ?? '');
  }, [subTitle]);

  return (
    <div className="flex">
      <Avatar {...props} name={username} />
      {!hiddenName && (
        <div className="ml-2 grid items-center">
          <span className="text-base font-bold">{title}</span>
          <span className="text-sm text-stone-500">{secondaryTitle}</span>
        </div>
      )}
    </div>
  );
};

export default AvatarWithUsername;
