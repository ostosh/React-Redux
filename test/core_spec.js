import {expect} from 'chai';
import {List, Map} from 'immutable';

import {setEntries, next, vote} from '../src/core';


describe('application logic', () => {
  
  describe('setEntries', () => {  
    it('adds entries to the state', () => {
      const state = Map();
      const entries = List.of('Trainspotting', '28 Days Later');
      const nextState = setEntries(state, entries);
      
      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting', '28 Days Later')
      }));
    });
    
    it('converts to immutable', () => {
      const state = Map();
      const entries = ['Trainspotting', '28 Days Later'];
      const nextState = setEntries(state, entries);
      
      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting', '28 Days Later')
      }));
    });
  });
  
  describe('next', () => {
    it('takes  the next two entries under vote', () => {
      const state = Map({
        entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        entries: List.of('Sunshine'),
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later')
        })  
      }));
    });
  });
  
  describe('vote', () => {
    it('creates a tally for the voted entry', () => {
      const state = Map({
        pair: List.of('Trainspotting', '28 Days Later')
      });  
      
      const nextState = vote(state, 'Trainspotting');
      expect(nextState).to.equal(Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({'Trainspotting' : 1})
      }));
    });
    
    it('increment tally for existing voted entry', () => {
      const state = Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting' : 3,
          '28 Days Later' : 2
        })
      });
      const nextState = vote(state, 'Trainspotting');
      
      expect(nextState).to.equal(Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting' : 4,
          '28 Days Later' : 2
        })
      }));
    });
    
    it('puts current vote winner back in entries', () => {
      const state = Map({
        entries: List.of('Sunshine', 'Millions', '127 Hours'),
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 2  
          })
        })
      });
      const nextState =  next(state);
      expect(nextState).to.equal(Map({
        entries: List.of('127 Hours', 'Trainspotting'),
        vote: Map({
          pair: List.of('Sunshine', 'Millions')
        })        
      }));
    });
    
    it('puts current vote tie pair back in entries', () => {
      const state = Map({
        entries: List.of('Sunshine', 'Millions', '127 Hours'),
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 3,
            '28 Days Later': 3
          })
        })
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        entries: List.of('127 Hours', 'Trainspotting', '28 Days Later'),
        vote: Map({
          pair: List.of('Sunshine', 'Millions')
        })
      }));
    });
    
    it('marks winner when only one entry left', () => {
      const state = Map({
        entries: List(),
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 2
          })
        })
      });
  
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        winner: 'Trainspotting'
      }));    
    });
    
  });
  
});