Text file: docs.n8n.io_integrations_builtin_core-nodes_n8n-nodes-base.httprequest_.md
Latest content with line numbers:
2	
3	**URL:** https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/
4	
5	---
6	
7	Skip to content
8	n8n Docs
9	Chat with the docs
10	Type to start searching
11	Using n8n
12	Integrations
13	Hosting n8n
14	Code in n8n
15	Advanced AI
16	API
17	Embed
18	n8n home ↗
19	Forum ↗
20	Tutorials (blog) ↗
21	Integrations
22	Built-in nodes
23	Node types
24	Core nodes
25	Activation Trigger
26	Aggregate
27	AI Transform
28	Code
29	Compare Datasets
30	Compression
31	Chat Trigger
32	Convert to File
33	Crypto
34	Data table
35	Date & Time
36	Debug Helper
37	Edit Fields (Set)
38	Edit Image
39	Email Trigger (IMAP)
40	Error Trigger
41	Evaluation
42	Evaluation Trigger
43	Execute Command
44	Execute Sub-workflow
45	Execute Sub-workflow Trigger
46	Execution Data
47	Extract From File
48	Filter
49	FTP
50	Git
51	GraphQL
52	HTML
53	HTTP Request
54	Common issues
55	If
56	JWT
57	LDAP
58	Limit
59	Local File Trigger
60	Loop Over Items (Split in Batches)
61	Manual Trigger
62	Markdown
63	MCP Server Trigger
64	Merge
65	n8n
66	n8n Form
67	n8n Form Trigger
68	n8n Trigger
69	No Operation, do nothing
70	Read/Write Files from Disk
71	Remove Duplicates
72	Rename Keys
73	Respond to Chat
74	Respond to Webhook
75	RSS Read
76	RSS Feed Trigger
77	Schedule Trigger
78	Send Email
79	Sort
80	Split Out
81	SSE Trigger
82	SSH
83	Stop And Error
84	Summarize
85	Switch
86	TOTP
87	Wait
88	Webhook
89	Workflow Trigger
90	XML
91	Actions
92	Triggers
93	Cluster nodes
94	Credentials
95	Custom API actions for existing nodes
96	Handle rate limits
97	Community nodes
98	Installation and management
99	Risks
100	Blocklist
101	Using community nodes
102	Troubleshooting
103	Building community nodes
104	Creating nodes
105	Overview
106	Plan your node
107	Build your node
108	Test your node
109	Deploy your node
110	Table of contents
111	Node parameters
112	Method
113	URL
114	Authentication
115	Predefined credentials
116	Generic credentials
117	Send Query Parameters
118	Send Headers
119	Send Body
120	Form URLencoded
121	Form-Data
122	JSON
123	n8n Binary File
124	Raw
125	Node options
126	Array Format in Query Parameters
127	Batching
128	Ignore SSL Issues
129	Lowercase Headers
130	Redirects
131	Response
132	Pagination
133	Proxy
134	Timeout
135	Tool-only options
136	Optimize Response
137	JSON
138	HTML
139	Text
140	Import curl command
141	Templates and examples
142	Common issues
143	Integrations
144	Built-in nodes
145	Core nodes
146	HTTP Request
147	HTTP Request node#
148	
149	The HTTP Request node is one of the most versatile nodes in n8n. It allows you to make HTTP requests to query data from any app or service with a REST API. You can use the HTTP Request node a regular node or attached to an AI agent to use as a tool.
150	
151	When using this node, you're creating a REST API call. You need some understanding of basic API terminology and concepts.
152	
153	There are two ways to create an HTTP request: configure the node parameters or import a curl command.
154	
155	Credentials
156	
157	Refer to HTTP Request credentials for guidance on setting up authentication.
158	
159	Node parameters#
160	Method#
161	
162	Select the method to use for the request:
163	
164	DELETE
165	GET
166	HEAD
167	OPTIONS
168	PATCH
169	POST
170	PUT
171	URL#
172	
173	Enter the endpoint you want to use.
174	
175	Authentication#
176	
177	n8n recommends using the Predefined Credential Type option when it's available. It offers an easier way to set up and manage credentials, compared to configuring generic credentials.
178	
179	Predefined credentials#
180	
181	Credentials for integrations supported by n8n, including both built-in and community nodes. Use Predefined Credential Type for custom operations without extra setup. Refer to Custom API operations for more information.
182	
183	Generic credentials#
184	
185	Credentials for integrations not supported by n8n. You'll need to manually configure the authentication process, including specifying the required API endpoints, necessary parameters, and the authentication method.
186	
187	You can select one of the following methods:
188	
189	Basic auth
190	Custom auth
191	Digest auth
192	Header auth
193	OAuth1 API
194	OAuth2 API
195	Query auth
196	
197	Refer to HTTP request credentials for more information on setting up each credential type.
198	
199	Send Query Parameters#
200	
201	Query parameters act as filters on HTTP requests. If the API you're interacting with supports them and the request you're making needs a filter, turn this option on.
202	
203	Specify your query parameters using one of the available options:
204	
205	Using Fields Below: Enter Name/Value pairs of Query Parameters. To enter more query parameter name/value pairs, select Add Parameter. The name is the name of the field you're filtering on, and the value is the filter value.
206	Using JSON: Enter JSON to define your query parameters.
207	
208	Refer to your service's API documentation for detailed guidance.
209	
210	Send Headers#
211	
212	Use this parameter to send headers with your request. Headers contain metadata or context about your request.
213	
214	Specify Headers using one of the available options:
215	
216	Using Fields Below: Enter Name/Value pairs of Header Parameters. To enter more header parameter name/value pairs, select Add Parameter. The name is the header you wish to set, and the value is the value you want to pass for that header.
217	Using JSON: Enter JSON to define your header parameters.
218	
219	Refer to your service's API documentation for detailed guidance.
220	
221	Send Body#
222	
223	If you need to send a body with your API request, turn this option on.
224	
225	Then select the Body Content Type that best matches the format for the body content you wish to send.
226	
227	Form URLencoded#
228	
229	Use this option to send your body as application/x-www-form-urlencoded.
230	
231	Specify Body using one of the available options:
232	
233	Using Fields Below: Enter Name/Value pairs of Body Parameters. To enter more body parameter name/value pairs, select Add Parameter. The name should be the form field name, and the value is what you wish to set that field to.
234	Using Single Field: Enter your name/value pairs in a single Body parameter with format fieldname1=value1&fieldname2=value2.
235	
236	Refer to your service's API documentation for detailed guidance.
237	
238	Form-Data#
239	
240	Use this option to send your body as multipart/form-data.
241	
242	Configure your Body Parameters by selecting the Parameter Type:
243	
244	Choose Form Data to enter Name/Value pairs.
245	Choose n8n Binary File to pull the body from a file the node has access to.
246	Name: Enter the ID of the field to set.
247	Input Data Field Name: Enter the name of the incoming field containing the binary file data you want to process.
248	
249	Select Add Parameter to enter more parameters.
250	
251	Refer to your service's API documentation for detailed guidance.
252	
253	JSON#
254	
255	Use this option to send your body as JSON.
256	
257	Specify Body using one of the available options:
258	
259	Using Fields Below: Enter Name/Value pairs of Body Parameters. To enter more body parameter name/value pairs, select Add Parameter.
260	Using JSON: Enter JSON to define your body.
261	
262	Refer to your service's API documentation for detailed guidance.
263	
264	n8n Binary File#
265	
266	Use this option to send the contents of a file stored in n8n as the body.
267	
268	Enter the name of the incoming field that contains the file as the Input Data Field Name.
269	
270	Refer to your service's API documentation for detailed guidance on how to format the file.
271	
272	Raw#
273	
274	Use this option to send raw data in the body.
275	
276	Content Type: Enter the Content-Type header to use for the raw body content. Refer to the IANA Media types documentation for a full list of MIME content types.
277	Body: Enter the raw body content to send.
278	
279	Refer to your service's API documentation for detailed guidance.
280	
281	Node options#
282	
283	Select Add Option to view and select these options. Options are available to all parameters unless otherwise noted.
284	
285	Array Format in Query Parameters#
286	
287	Option availability
288	
289	This option is only available when you turn on Send Query Parameters.
290	
291	Use this option to control the format for arrays included in query parameters. Choose from these options:
292	
293	No Brackets: Arrays will format as the name=value for each item in the array, for example: foo=bar&foo=qux.
294	Brackets Only: The node adds square brackets after each array name, for example: foo[]=bar&foo[]=qux.
295	Brackets with Indices: The node adds square brackets with an index value after each array name, for example: foo[0]=bar&foo[1]=qux.
296	
297	Refer to your service's API documentation for guidance on which option to use.
298	
299	Batching#
300	
301	Control how to batch large numbers of input items:
302	
303	Items per Batch: Enter the number of input items to include in each batch.
304	Batch Interval: Enter the time to wait between each batch of requests in milliseconds. Enter 0 for no batch interval.
305	Ignore SSL Issues#
306	
307	By default, n8n only downloads the response if SSL certificate validation succeeds. If you'd like to download the response even if SSL certificate validation fails, turn this option on.
308	
309	Lowercase Headers#
310	
311	Choose whether to lowercase header names (turned on, default) or not (turned off).
312	
313	Redirects#
314	
315	Choose whether to follow redirects (turned on by default) or not (turned off). If turned on, enter the maximum number of redirects the request should follow in Max Redirects.
316	
317	Response#
318	
319	Use this option to set some details about the expected API response, including:
320	
321	Include Response Headers and Status: By default, the node returns only the body. Turn this option on to return the full response (headers and response status code) as well as the body.
322	Never Error: By default, the node returns success only when the response returns with a 2xx code. Turn this option on to return success regardless of the code returned.
323	Response Format: Select the format in which the data gets returned. Choose from:
324	Autodetect (default): The node detects and formats the response based on the data returned.
325	File: Select this option to put the response into a file. Enter the field name where you want the file returned in Put Output in Field.
326	JSON: Select this option to format the response as JSON.
327	Text: Select this option to format the response as plain text. Enter the field name where you want the file returned in Put Output in Field.
328	Pagination#
329	
330	Use this option to paginate results, useful for handling query results that are too big for the API to return in a single call.
331	
332	Inspect the API data first
333	
334	Some options for pagination require knowledge of the data returned by the API you're using. Before setting up pagination, either check the API documentation, or do an API call without pagination, to see the data it returns.
335	
336	Understand pagination
337	
338	Configure the pagination settings:
339	
340	Pagination Mode:
341	Off: Turn off pagination.
342	Update a Parameter in Each Request: Use this when you need to dynamically set parameters for each request.
343	Response Contains Next URL: Use this when the API response includes the URL of the next page. Use an expression to set Next URL.
344	
345	(Content truncated due to size limit. Use page ranges or line ranges to read remaining content)