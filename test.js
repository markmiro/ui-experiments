import test from 'ava';
import deepFreeze from 'deep-freeze';
import {createStore, combineReducers} from 'redux';

const todo = (state, action) => {
  switch (action.type)  {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) return state;
      return {
        ...state,
        completed: !state.completed
      };
    default: return state;
  }
}

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(state, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default: return state;
  }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default: return state;
  }
}

const todoApp = combineReducers({todos, visibilityFilter});
// const todoApp = (state = {}, action) => {
//   return {
//     todos: todos(state.todos, action),
//     visibilityFilter: visibilityFilter(state.visibilityFilter, action)
//   }
// };

test('Basic initialization', t => {
  const store = createStore(todoApp);
  t.same(store.getState(), {
    todos: [],
    visibilityFilter: 'SHOW_ALL'
  });
});

test('SET_VISIBILITY_FILTER with store', t => {
  const store = createStore(todoApp);
  store.dispatch({type: 'SET_VISIBILITY_FILTER', filter: 'SHOW_COMPLETED'});
  t.same(store.getState(), {
    todos: [],
    visibilityFilter: 'SHOW_COMPLETED'
  });
});

test('SET_VISIBILITY_FILTER', t => {
  const beforeFilter = 'SHOW_ALL';
  const action = {
    type: 'SET_VISIBILITY_FILTER',
    filter: 'SHOW_COMPLETED'
  };
  const afterFilter = 'SHOW_COMPLETED';
  t.same(visibilityFilter(beforeFilter, action), afterFilter);
});

test('ADD_TODO', t => {
  const stateBefore = [];
  const action = {
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn Redux'
  };
  const stateAfter = [{
    id: 0,
    text: 'Learn Redux',
    completed: false
  }];
  deepFreeze(stateBefore);
  deepFreeze(action);
  t.same(
    todos(stateBefore, action),
    stateAfter
  );
});

test('TOGGLE_TODO', t => {
  const stateBefore = [
    {
      id: 0,
      text: 'Each stuff',
      completed: false
    },
    {
      id: 1,
      text: 'Buy a couch',
      completed: false
    }
  ];
  const action = {
    type: 'TOGGLE_TODO',
    id: 1
  };
  const stateAfter = [
    {
      id: 0,
      text: 'Each stuff',
      completed: false
    },
    {
      id: 1,
      text: 'Buy a couch',
      completed: true
    }
  ];
  deepFreeze(action);
  deepFreeze(stateBefore);
  t.same(todos(stateBefore, action), stateAfter);
});





const toggleTodo = todo => ({
  ...todo,
  completed: !todo.completed
});

test('basic toggle', t => {
  const todoBefore = {
    id: 0,
    text: 'Learn Redux',
    completed: false
  };
  const todoAfter = {
    id: 0,
    text: 'Learn Redux',
    completed: true
  };
  deepFreeze(todoBefore);
  t.same(toggleTodo(todoBefore), todoAfter);
});
