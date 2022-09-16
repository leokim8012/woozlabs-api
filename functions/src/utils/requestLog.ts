export const requestLog = (request: string): void => {
  console.log(
    `====${request}====\n${new Date().toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
    })}`
  );
};
