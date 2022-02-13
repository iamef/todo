// thank you internet: https://www.pluralsight.com/guides/how-to-communicate-between-independent-components-in-reactjs
export const eventBus = {
    on(event, callback){
        // add event listener
        document.addEventListener(event, (e) => callback(e.detail));
    },
    dispatch(event, data){
        // fires an event
        document.dispatchEvent(new CustomEvent(event, {detail: data}));
    },
    remove(event, callback){
        document.removeEventListener(event, callback);
    }
};