/**
 * Requirements :-
 * 
 * 1. it should maintain a list of subscribers
 * 2. contains two component - Subject/Observer
 * 3. observers either subscribe or unsubscribe from Subject - methods - subscribe(), unsubscribe()
 * 4. when any event is generated on the subject, it notifies its observer (by calling notify() method or the callback supplied)
 * 5. an observer can subscribe to one or more events
 */

 const [_Subject, _Observer] = (() => {
    class Subject {
        constructor() {
            const observers = new Set();
            this.actions = {
                addObserver: (observer) => observers.add(observer),
                removeObserver: (observer) => observers.delete(observer),
                updateObservers: (data) => observers.forEach(observer => {
                    observer.addSubject(this);
                    observer.update(data);
                })
            }
        }

        _validate(observer) {
            if(!(observer instanceof Observer)) {
                throw new Error("the observer supplied is not a valid type, either it should be Observer or sub-class of it");
            }
        }

        subscribe(observer) {
            this._validate(observer);
            this.actions.addObserver(observer);
        }

        unsubscribe(observer) {
            this._validate(observer);
            this.actions.removeObserver(observer);
        }

        notify(data) {
            this.actions.updateObservers(data);
        }
    }

    class Observer {
        #subject = null;

        addSubject(subject) {
            if(subject instanceof Subject) {
                this.#subject = subject;
            }
        }

        getSubject() {
            return this.#subject;
        }

        update() {
            throw new Error(`update method is not implemented in  ${this.constructor.name} (Observer)`);
        }
    }

    Object.freeze(Subject);
    Object.freeze(Observer);

    return [Subject, Observer];
})();

export const Subject = _Subject;
export const Observer = _Observer;
