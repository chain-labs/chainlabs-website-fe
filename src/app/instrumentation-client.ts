import { initBotId } from 'botid/client/core';
 
initBotId({
  protect: [
    {
      path: '/api/verify-captcha',
      method: 'POST',
    },
  ],
});