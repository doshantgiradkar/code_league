import React from 'react';
import { useParams } from 'react-router-dom';

const Hello = () => {
  const { name } = useParams();
  return (
    <div>
    Hello { name }
    </div>
  );
};

export default Hello;
