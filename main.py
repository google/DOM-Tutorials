"""
Copyright 2013-2020 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""

import cgi
from google.cloud import ndb


# Datastore model.
class Grid(ndb.Model):
  data = ndb.StringProperty(required=True)


# Route to requested handler.
def app(environ, start_response):
  if environ["PATH_INFO"] == "/":
    return redirect(environ, start_response)
  if environ["PATH_INFO"] == "/add.py":
    return add(environ, start_response)
  if environ["PATH_INFO"] == "/collab.py":
    return collab(environ, start_response)
  start_response("404 Not Found", [])
  return [b"Page not found."]


# Redirect for root directory.
def redirect(environ, start_response):
  headers = [
    ("Location", "/static/index.html")
  ]
  start_response("301 Found", headers)
  return []


# Parse a string into a number.
def num(s):
  try:
    return int(s)
  except:
    try:
      return float(s)
    except:
      return 0


# Add two numbers together.
def add(environ, start_response):
  forms = cgi.FieldStorage(environ=environ)
  a = 0
  if "a" in forms:
    a = num(forms["a"].value)
  b = 0
  if "b" in forms:
    b = num(forms["b"].value)
  out = str(a + b)

  headers = [
    ("Content-Type", "text/plain")
  ]
  start_response("200 OK", headers)
  return [out.encode("utf-8")]


# Collaborative star grid.
def collab(environ, start_response):
  forms = cgi.FieldStorage(fp=environ['wsgi.input'], environ=environ)
  try:
    n = int(forms["n"].value)
  except:
    n = -1
  try:
    s = forms["s"].value
  except:
    s = None
  isUpdate = (0 <= n <= 99) and (s in ("0", "1"))

  client = ndb.Client()
  with client.context():
    result = Grid.get_by_id("STARS")
  if result:
    data = result.data
  else:
    data = "0" * 100

  if isUpdate:
    # Change the requested value.
    data = data[:n] + s + data[n + 1:]
    # Store the new grid.
    with client.context():
      row = Grid(id="STARS", data=data)
      row.put()

  headers = [
    ("Content-Type", "text/plain")
  ]
  start_response("200 OK", headers)
  return [data.encode("utf-8")]
