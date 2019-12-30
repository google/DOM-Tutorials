#!/usr/bin/python
# Server-side database for collaborative stars exercise.
#
# Copyright 2013-2019 Google LLC
# https://dom-tutorials.appspot.com/
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import cgi
from google.appengine.ext import db

print("Content-Type: text/plain\n")
forms = cgi.FieldStorage()

try:
  n = int(forms["n"].value)
except:
  n = -1
try:
  s = forms["s"].value
except:
  s = None
isUpdate = (0 <= n <= 99) and (s in ("0", "1"))

class Grid(db.Model):
  data = db.StringProperty(required=True)

# Get the first (and only) grid instance.
query = Grid.all()
grid = query.get()

if not grid:
  # First-time execution.
  grid = Grid(data = "0" * 100)

if isUpdate:
  # Change the requested value.
  grid.data = grid.data[:n] + s + grid.data[n + 1:]
  # Store the new grid.
  grid.put()
output = grid.data

print(output)
