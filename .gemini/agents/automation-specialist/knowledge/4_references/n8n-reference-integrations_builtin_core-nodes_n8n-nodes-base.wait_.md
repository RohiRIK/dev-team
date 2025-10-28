Text file: docs.n8n.io_integrations_builtin_core-nodes_n8n-nodes-base.wait_.md
Latest content with line numbers:
1	# Wait | n8n Docs
2	
3	**URL:** https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.wait/
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
54	If
55	JWT
56	LDAP
57	Limit
58	Local File Trigger
59	Loop Over Items (Split in Batches)
60	Manual Trigger
61	Markdown
62	MCP Server Trigger
63	Merge
64	n8n
65	n8n Form
66	n8n Form Trigger
67	n8n Trigger
68	No Operation, do nothing
69	Read/Write Files from Disk
70	Remove Duplicates
71	Rename Keys
72	Respond to Chat
73	Respond to Webhook
74	RSS Read
75	RSS Feed Trigger
76	Schedule Trigger
77	Send Email
78	Sort
79	Split Out
80	SSE Trigger
81	SSH
82	Stop And Error
83	Summarize
84	Switch
85	TOTP
86	Wait
87	Webhook
88	Workflow Trigger
89	XML
90	Actions
91	Triggers
92	Cluster nodes
93	Credentials
94	Custom API actions for existing nodes
95	Handle rate limits
96	Community nodes
97	Installation and management
98	Risks
99	Blocklist
100	Using community nodes
101	Troubleshooting
102	Building community nodes
103	Creating nodes
104	Overview
105	Plan your node
106	Build your node
107	Test your node
108	Deploy your node
109	Table of contents
110	Operations
111	After Time Interval
112	At Specified Time
113	On Webhook Call
114	Authentication
115	HTTP Method
116	Response Code
117	Respond
118	Limit Wait Time
119	On Webhook Call options
120	On Webhook Call limitations
121	On Form Submitted
122	Form Title
123	Form Description
124	Form Fields
125	Respond When
126	Limit Wait Time
127	On Form Response options
128	Templates and examples
129	Time-based operations
130	Integrations
131	Built-in nodes
132	Core nodes
133	Wait#
134	
135	Use the Wait node pause your workflow's execution. When the workflow pauses it offloads the execution data to the database. When the resume condition is met, the workflow reloads the data and the execution continues.
136	
137	Operations#
138	
139	The Wait node can Resume on the following conditions:
140	
141	After Time Interval: The node waits for a certain amount of time.
142	At Specified Time: The node waits until a specific time.
143	On Webhook Call: The node waits until it receives an HTTP call.
144	On Form Submitted: The node waits until it receives a form submission.
145	
146	Refer to the more detailed sections below for more detailed instructions.
147	
148	After Time Interval#
149	
150	Wait for a certain amount of time.
151	
152	This parameter includes two more fields:
153	
154	Wait Amount: Enter the amount of time to wait.
155	Wait Unit: Select the unit of measure for the Wait Amount. Choose from:
156	Seconds
157	Minutes
158	Hours
159	Days
160	
161	Refer to Time-based operations for more detail on how these intervals work and the timezone used.
162	
163	At Specified Time#
164	
165	Wait until a specific date and time to continue. Use the date and time picker to set the Date and Time.
166	
167	Refer to Time-based operations for more detail on the timezone used.
168	
169	On Webhook Call#
170	
171	This parameter enables your workflows to resume when the Wait node receives an HTTP call.
172	
173	The webhook URL that resumes the execution when called is generated at runtime. The Wait node provides the $execution.resumeUrl variable so that you can reference and send the yet-to-be-generated URL wherever needed, for example to a third-party service or in an email.
174	
175	When the workflow executes, the Wait node generates the resume URL and the webhook(s) in your workflow using the $execution.resumeUrl. This generated URL is unique to each execution, so your workflow can contain multiple Wait nodes and as the webhook URL is called it will resume each Wait node sequentially.
176	
177	For this Resume style, set more parameters listed below.
178	
179	Authentication#
180	
181	Select if and how incoming resume-webhook-requests to $execution.resumeUrl should be authenticated. Options include:
182	
183	Basic Auth: Use basic authentication. Select or enter a new Credential for Basic Auth to use.
184	Header Auth: Use header authentication. Select or enter a new Credential for Header Auth to use.
185	JWT Auth: Use JWT authentication. Select or enter a new Credential for JWT Auth to use.
186	None: Don't use authentication.
187	
188	Auth reference
189	
190	Refer to the Webhook node | Authentication documentation for more information on each auth type.
191	
192	HTTP Method#
193	
194	Select the HTTP method the webhook should use. Refer to the Webhook node | HTTP Method documentation for more information.
195	
196	Response Code#
197	
198	Enter the Response Code the webhook should return. You can use common codes or enter a custom code.
199	
200	Respond#
201	
202	Set when and how to respond to the webhook from these options:
203	
204	Immediately: Respond as soon as the node executes.
205	When Last Node Finishes: Return the response code and the data output from the last node executed in the workflow. If you select this option, also set:
206	Response Data: Select what data should be returned and what format to use. Options include:
207	All Entries: Returns all the entries of the last node in an array.
208	First Entry JSON: Return the JSON data of the first entry of the last node in a JSON object.
209	First Entry Binary: Return the binary data of the first entry of the last node in a binary file.
210	No Response Body: Return with no body.
211	Using 'Respond to Webhook' Node: Respond as defined in the Respond to Webhook node.
212	Limit Wait Time#
213	
214	Set whether the workflow will automatically resume execution after a specific limit type (turned on) or not (turned off). If turned on, also set:
215	
216	Limit Type: Select what type of limit to enforce from these options:
217	After Time Interval: Wait for a certain amount of time.
218	Enter the limit's Amount of time.
219	Select the limit's Unit of time.
220	At Specified Time: Wait until a specific date and time to resume.
221	Max Date and Time: Use the date and time picker to set the specified time the node should resume.
222	On Webhook Call options#
223	Binary Property: Enter the name of the binary property to write the data of the received file to. This option's only relevant if binary data is received.
224	Ignore Bots: Set whether to ignore requests from bots like link previewers and web crawlers (turned on) or not (turned off).
225	IP(s) Whitelist: Enter IP addresses here to limit who (or what) can invoke the webhook URL. Enter a comma-separated list of allowed IP addresses. Access from IPs outside the whitelist throws a 403 error. If left blank, all IP addresses can invoke the webhook URL.
226	No Response Body: Set whether n8n should send a body in the response (turned off) or prevent n8n from sending a body in the response (turned on).
227	Raw Body: Set whether to return the body in a raw format like JSON or XML (turned on) or not (turned off).
228	Response Data: Enter any custom data you want to send in the response.
229	Response Headers: Send more headers in the webhook response. Refer to MDN Web Docs | Response header to learn more about response headers.
230	Webhook Suffix: Enter a suffix to append to the resume URL. This is useful for creating unique webhook URLs for each Wait node when a workflow contains multiple Wait nodes. Note that the generated $resumeWebhookUrl won't automatically include this suffix, you must manually append it to the webhook URL before exposing it.
231	On Webhook Call limitations#
232	
233	There are some limitations to keep in mind when using On Webhook Call:
234	
235	Partial executions of your workflow changes the $resumeWebhookUrl, so be sure that the node sending this URL to your desired third-party runs in the same execution as the Wait node.
236	On Form Submitted#
237	
238	Wait for a form submission before continuing. Set up these parameters:
239	
240	Form Title#
241	
242	Enter the title to display at the top of the form.
243	
244	Form Description#
245	
246	Enter a form description to display beneath the title. This description can help prompt the user on how to complete the form.
247	
248	Form Fields#
249	
250	Set up each field you want to appear on your form using these parameters:
251	
252	Field Label: Enter the field label you want to appear in the form.
253	Field Type: Select the type of field to display in the form. Choose from:
254	Date
255	Dropdown List: Enter each dropdown options in the Field Options.
256	Multiple Choice: Select whether the user can select a single dropdown option (turned off) or multiple dropdown options (turned on)
257	Number
258	Password
259	Text
260	Textarea
261	Required Field: Set whether the user must complete this field in order to submit the form (turned on) or if the user can submit the form without completing it (turned off).
262	Respond When#
263	
264	Set when to respond to the form submission. Choose from:
265	
266	Form Is Submitted: Respond as soon as this node receives the form submission.
267	Workflow Finishes: Respond when the last node of this workflow finishes.
268	Using 'Respond to Webhook' Node: Respond when the Respond to Webhook node executes.
269	Limit Wait Time#
270	
271	Set whether the workflow will automatically resume execution after a specific limit type (turned on) or not (turned off).
272	
273	If turned on, also set: * Limit Type: Select what type of limit to enforce from these options: * After Time Interval: Wait for a certain amount of time. * Enter the limit's Amount of time. * Select the limit's Unit of time. * At Specified Time: Wait until a specific date and time to resume. * Max Date and Time: Use the date and time picker to set the specified time the node should resume.
274	
275	On Form Response options#
276	Form Response: Choose how and what you want the form to Respond With from these options:
277	Form Submitted Text: The form displays whatever text is entered in Text to Show after a user fills out the form. Use this option if you want to display a confirmation message.
278	Redirect URL: The form will redirect the user to the URL to Redirect to after they fill out the form. This must be a valid URL.
279	Webhook Suffix: Enter a suffix to append to the resume URL. This is useful for creating unique webhook URLs for each Wait node when a workflow contains multiple Wait nodes. Note that the generated $resumeWebhookUrl won't automatically include this suffix, you must manually append it to the webhook URL before exposing it.
280	Templates and examples#
281	Generate AI Viral Videos with Seedance and Upload to TikTok, YouTube & Instagram
282	
283	by Dr. Firas
284	
285	View template details
286	Generate AI Videos with Google Veo3, Save to Google Drive and Upload to YouTube
287	
288	by Davide
289	
290	View template details
291	Scrape business emails from Google Maps without the use of any third party APIs
292	
293	by Akram Kadri
294	
295	View template details
296	Browse Wait integration templates, or search all templates
297	Time-based operations#
298	
299	For the time-based resume operations, note that:
300	
301	For wait times less than 65 seconds, the workflow doesn't offload execution data to the database. Instead, the process continues to run and the execution resumes after the specified interval passes.
302	The n8n server time is always used regardless of the timezone setting. Workflow timezone settings, and any changes made to them, don't affect the Wait node interval or specified time.
303	Chat with the docs
304	This page was
305	Helpful
306	Not helpful
307	 Back to top
308	Previous
309	TOTP
310	Next
311	Webhook node documentation
312	Made with Material for MkDocs Insiders