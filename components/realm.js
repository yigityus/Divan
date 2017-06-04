////////////////////////////////////////////////////////////////////////////
//
// Copyright 2016 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

'use strict';

import Realm from 'realm';

class Couplet extends Realm.Object {}
Couplet.schema = {
  name: 'Couplet',
  properties: {
    id: {type: 'int'},
    line1: {type: 'string'},
    line2: {type: 'string'},
  },
};

class Poem extends Realm.Object {}
Poem.schema = {
  name: 'Poem',
  properties: {
    id: {type: 'int'},
    name: {type: 'string'},
    rhythm: {type: 'string'},
    couplets: {type: 'list', objectType: 'Couplet'},
  },
};

class Tag extends Realm.Object {}
Tag.schema = {
    name: 'Tag',
    properties: {
        name: {type: 'string'},
        poems: {type: 'list', objectType: 'Poem'},
    },
};

export default new Realm({schema: [Todo, TodoList]});
