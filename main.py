"""
Copyright 2013-2023 Google LLC

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

from google.cloud import ndb
from urllib.parse import unquote


# Datastore model.
class Grid(ndb.Model):
  data = ndb.StringProperty(required=True)

# Parse a query string (e.g. a=1&b=2) into a dictionary (e.g. {"a": 1, "b": 2}).
# Very minimal parser.  Does not combine repeated names (a=1&a=2), ignores
# valueless names (a&b), does not support isindex.
def parse_query(query_string):
  parts = query_string.split('&')
  dict = {}
  for part in parts:
    tuple = part.split("=", 1)
    if len(tuple) == 2:
      dict[tuple[0]] = unquote(tuple[1])
  return dict

# Route to requested handler.
def app(environ, start_response):
  query_string = ""
  if "QUERY_STRING" in environ:
    query_string = environ["QUERY_STRING"]
  query_dict = parse_query(query_string)
  if environ["PATH_INFO"] == "/":
    return redirect(query_dict, start_response)
  if environ["PATH_INFO"] == "/add.py":
    return add(query_dict, start_response)
  if environ["PATH_INFO"] == "/collab.py":
    return collab(query_dict, start_response)
  start_response("404 Not Found", [])
  return [b"Page not found."]


# Redirect for root directory.
def redirect(query_dict, start_response):
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
def add(query_dict, start_response):
  a = 0
  if "a" in query_dict:
    a = num(query_dict["a"])
  b = 0
  if "b" in query_dict:
    b = num(query_dict["b"])
  out = str(a + b)

  headers = [
    ("Content-Type", "text/plain")
  ]
  start_response("200 OK", headers)
  return [out.encode("utf-8")]


# Collaborative star grid.
def collab(query_dict, start_response):
  try:
    n = int(query_dict["n"])
  except:
    n = -1
  try:
    s = query_dict["s"]
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
