#!/usr/bin/python
# Server-side addition service for Asynchronous Server Requests tutorial.
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

def num(s):
  try:
    return int(s)
  except:
    try:
      return float(s)
    except:
      return 0

print("Content-Type: text/plain\n")
forms = cgi.FieldStorage()

a = 0
if "a" in forms:
  a = num(forms["a"].value)
b = 0
if "b" in forms:
  b = num(forms["b"].value)

print(a + b)
