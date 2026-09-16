// app/utils/urlParams.js
export const updateStepInURL = (step, router, replace = false) => {
  const stepParams = {
    1: 'datetime',
    2: 'information',
    3: 'review'
  };
  
  const stepValue = stepParams[step];
  if (replace) {
    router.replace(`/consultation?step=${stepValue}`, { scroll: false });
  } else {
    router.push(`/consultation?step=${stepValue}`, { scroll: false });
  }
};

export const getStepFromPath = (searchParams) => {
  const step = searchParams.get('step');
  if (step === 'datetime') return 1;
  if (step === 'information') return 2;
  if (step === 'review') return 3;
  return 1;
};