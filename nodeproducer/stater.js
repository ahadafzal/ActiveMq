const mainproducer =  require('./mainProducer');


setInterval(async () => {
    const msg = {afzal:"khan"};
    await mainproducer.sendMessage(JSON.stringify(msg));
    console.info(`pushed to static queue 1`);
}, 3000);
