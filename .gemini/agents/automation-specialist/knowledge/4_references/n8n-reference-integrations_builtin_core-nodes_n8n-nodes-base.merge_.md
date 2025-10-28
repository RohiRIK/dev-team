Text file: docs.n8n.io_integrations_builtin_core-nodes_n8n-nodes-base.merge_.md
Latest content with line numbers:
1	# Merge | n8n Docs
2	
3	**URL:** https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.merge/
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
110	Node parameters
111	Append
112	Combine
113	Matching Fields
114	Position
115	All Possible Combinations
116	Combine mode options
117	Clash Handling
118	SQL Query
119	Choose Branch
120	Templates and examples
121	Merging data streams with uneven numbers of items
122	Branch execution with If and Merge nodes
123	Try it out: A step by step example
124	Set up sample data using the Code nodes
125	Try out different merge modes
126	Append
127	Combine by Matching Fields
128	Combine by Position
129	Keep unpaired items
130	Combine by All Possible Combinations
131	Integrations
132	Built-in nodes
133	Core nodes
134	Merge#
135	
136	Use the Merge node to combine data from multiple streams, once data of all streams is available.
137	
138	Major changes in 0.194.0
139	
140	The n8n team overhauled this node in n8n 0.194.0. This document reflects the latest version of the node. If you're using an older version of n8n, you can find the previous version of this document here.
141	
142	Minor changes in 1.49.0
143	
144	n8n version 1.49.0 introduced the option to add more than two inputs. Older versions only support up to two inputs. If you're running an older version and want to combine multiple inputs in these versions, use the Code node.
145	
146	The Mode > SQL Query feature was also added in n8n version 1.49.0 and isn't available in older versions.
147	
148	Node parameters#
149	
150	You can specify how the Merge node should combine data from different data streams by choosing a Mode:
151	
152	Append#
153	
154	Keep data from all inputs. Choose a Number of Inputs to output items of each input, one after another. The node waits for the execution of all connected inputs.
155	
156	Append mode inputs and output
157	Combine#
158	
159	Combine data from two inputs. Select an option in Combine By to determine how you want to merge the input data.
160	
161	Matching Fields#
162	
163	Compare items by field values. Enter the fields you want to compare in Fields to Match.
164	
165	n8n's default behavior is to keep matching items. You can change this using the Output Type setting:
166	
167	Keep Matches: Merge items that match. This is like an inner join.
168	Keep Non-Matches: Merge items that don't match.
169	Keep Everything: Merge items together that do match and include items that don't match. This is like an outer join.
170	Enrich Input 1: Keep all data from Input 1, and add matching data from Input 2. This is like a left join.
171	Enrich Input 2: Keep all data from Input 2, and add matching data from Input 1. This is like a right join.
172	Combine by Matching Fields mode inputs and output
173	Position#
174	
175	Combine items based on their order. The item at index 0 in Input 1 merges with the item at index 0 in Input 2, and so on.
176	
177	Combine by Position mode inputs and output
178	All Possible Combinations#
179	
180	Output all possible item combinations, while merging fields with the same name.
181	
182	Combine by All Possible Combinations mode inputs and output
183	Combine mode options#
184	
185	When merging data by Mode > Combine, you can set these Options:
186	
187	Clash Handling: Choose how to merge when data streams clash, or when there are sub-fields. Refer to Clash handling for details.
188	Fuzzy Compare: Whether to tolerate type differences when comparing fields (enabled), or not (disabled, default). For example, when you enable this, n8n treats "3" and 3 as the same.
189	Disable Dot Notation: This prevents accessing child fields using parent.child in the field name.
190	Multiple Matches: Choose how n8n handles multiple matches when comparing data streams.
191	Include All Matches: Output multiple items if there are multiple matches, one for each match.
192	Include First Match Only: Keep the first item per match and discard the remaining multiple matches.
193	Include Any Unpaired Items: Choose whether to keep or discard unpaired items when merging by position. The default behavior is to leave out the items without a match.
194	CLASH HANDLING#
195	
196	If multiple items at an index have a field with the same name, this is a clash. For example, if all items in both Input 1 and Input 2 have a field named language, these fields clash. By default, n8n prioritizes Input 2, meaning if language has a value in Input 2, n8n uses that value when merging the items.
197	
198	You can change this behavior by selecting Options > Clash Handling:
199	
200	When Field Values Clash: Choose which input to prioritize, or choose Always Add Input Number to Field Names to keep all fields and values, with the input number appended to the field name to show which input it came from.
201	Merging Nested Fields
202	Deep Merge: Merge properties at all levels of the items, including nested objects. This is useful when dealing with complex, nested data structures where you need to ensure the merging of all levels of nested properties.
203	Shallow Merge: Merge properties at the top level of the items only, without merging nested objects. This is useful when you have flat data structures or when you only need to merge top-level properties without worrying about nested properties.
204	SQL Query#
205	
206	Write a custom SQL Query to merge the data.
207	
208	Example:
209	
210	1
211	SELECT * FROM input1 LEFT JOIN input2 ON input1.name = input2.id
212	
213	
214	Data from previous nodes are available as tables and you can use them in the SQL query as input1, input2, input3, and so on, based on their order. Refer to AlaSQL GitHub page for a full list of supported SQL statements.
215	
216	Choose Branch#
217	
218	Choose which input to keep. This option always waits until the data from both inputs is available. You can choose to Output:
219	
220	The Input 1 Data
221	The Input 2 Data
222	A Single, Empty Item
223	
224	The node outputs the data from the chosen input, without changing it.
225	
226	Templates and examples#
227	Scrape and summarize webpages with AI
228	
229	by n8n Team
230	
231	View template details
232	Generate AI Viral Videos with Seedance and Upload to TikTok, YouTube & Instagram
233	
234	by Dr. Firas
235	
236	View template details
237	✨🤖Automate Multi-Platform Social Media Content Creation with AI
238	
239	by Joseph LePage
240	
241	View template details
242	Browse Merge integration templates, or search all templates
243	Merging data streams with uneven numbers of items#
244	
245	The items passed into Input 1 of the Merge node will take precedence. For example, if the Merge node receives five items in Input 1 and 10 items in Input 2, it only processes five items. The remaining five items from Input 2 aren't processed.
246	
247	Branch execution with If and Merge nodes#
248	
249	0.236.0 and below
250	
251	n8n removed this execution behavior in version 1.0. This section applies to workflows using the v0 (legacy) workflow execution order. By default, this is all workflows built before version 1.0. You can change the execution order in your workflow settings.
252	
253	If you add a Merge node to a workflow containing an If node, it can result in both output data streams of the If node executing.
254	
255	One data stream triggers the Merge node, which then goes and executes the other data stream.
256	
257	For example, in the screenshot below there's a workflow containing an Edit Fields node, If node, and Merge node. The standard If node behavior is to execute one data stream (in the screenshot, this is the true output). However, due to the Merge node, both data streams execute, despite the If node not sending any data down the false data stream.
258	
259	Try it out: A step by step example#
260	
261	Create a workflow with some example input data to try out the Merge node.
262	
263	Set up sample data using the Code nodes#
264	Add a Code node to the canvas and connect it to the Start node.
265	Paste the following JavaScript code snippet in the JavaScript Code field:
266	 1
267	 2
268	 3
269	 4
270	 5
271	 6
272	 7
273	 8
274	 9
275	10
276	11
277	12
278	13
279	14
280	15
281	16
282	17
283	18
284	19
285	20
286	return [
287	  {
288	    json: {
289	      name: 'Stefan',
290	      language: 'de',
291	    }
292	  },
293	  {
294	    json: {
295	      name: 'Jim',
296	      language: 'en',
297	    }
298	  },
299	  {
300	    json: {
301	      name: 'Hans',
302	      language: 'de',
303	    }
304	  }
305	];
306	
307	Add a second Code node, and connect it to the Start node.
308	Paste the following JavaScript code snippet in the JavaScript Code field:
309	 1
310	 2
311	 3
312	 4
313	 5
314	 6
315	 7
316	 8
317	 9
318	10
319	11
320	12
321	13
322	14
323	return [
324		  {
325	    json: {
326	      greeting: 'Hello',
327	      language: 'en',
328	    }
329	  },
330	  {
331	    json: {
332	      greeting: 'Hallo',
333	      language: 'de',
334	    }
335	  }
336	];
337	
338	Try out different merge modes#
339	
340	Add the Merge node. Connect the first Code node to Input 1, and the second Code node to Input 2. Run the workflow to load data into the Merge node.
341	
342	The final workflow should look like this:
343	
344	View template details
345	
346	Now try different options in Mode to see how it affects the output data.
347	
348	Append#
349	
350	Select Mode > Append, then select Execute step.
351	
352	Your output in table view should look like this:
353	
354	name	language	greeting
355	Stefan	de	
356	Jim	en	
357	Hans	de	
358		en	Hello
359		de	Hallo
360	Combine by Matching Fields#
361	
362	You can merge these two data inputs so that each person gets the correct greeting for their language.
363	
364	Select Mode > Combine.
365	Select Combine by > Matching Fields.
366	In both Input 1 Field and Input 2 Field, enter language. This tells n8n to combine the data by matching the values in the language field in each data set.
367	Select Execute step.
368	
369	Your output in table view should look like this:
370	
371	name	language	greeting
372	Stefan	de	Hallo
373	Jim	en	Hello
374	Hans	de	Hallo
375	Combine by Position#
376	
377	Select Mode > Combine, Combine by > Position, then select Execute step.
378	
379	Your output in table view should look like this:
380	
381	name	language	greeting
382	Stefan	en	Hello
383	Jim	de	Hallo
384	KEEP UNPAIRED ITEMS#
385	
386	If you want to keep all items, select Add Option > Include Any Unpaired Items, then turn on Include Any Unpaired Items.
387	
388	Your output in table view should look like this:
389	
390	name	language	greeting
391	Stefan	en	Hello
392	Jim	de	Hallo
393	Hans	de	
394	Combine by All Possible Combinations#
395	
396	Select Mode > Combine, Combine by > All Possible Combinations, then select Execute step.
397	
398	Your output in table view should look like this:
399	
400	name	language	greeting
401	Stefan	en	Hello
402	Stefan	de	Hallo
403	Jim	en	Hello
404	Jim	de	Hallo
405	Hans	en	Hello
406	Hans	de	Hallo
407	Chat with the docs
408	This page was
409	Helpful
410	Not helpful
411	 Back to top
412	Previous
413	MCP Server Trigger
414	Next
415	n8n
416	Made with Material for MkDocs Insiders