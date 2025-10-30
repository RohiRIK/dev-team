Text file: docs.n8n.io_integrations_builtin_core-nodes_n8n-nodes-base.splitout_.md
Latest content with line numbers:
1	# Split Out | n8n Docs
2	
3	**URL:** https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.splitout/
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
111	Field to Split Out
112	Include
113	Node options
114	Disable Dot Notation
115	Destination Field Name
116	Include Binary
117	Templates and examples
118	Related resources
119	Integrations
120	Built-in nodes
121	Core nodes
122	Split Out#
123	
124	Use the Split Out node to separate a single data item containing a list into multiple items. For example, a list of customers, and you want to split them so that you have an item for each customer.
125	
126	Node parameters#
127	
128	Configure this node using the following parameters.
129	
130	Field to Split Out#
131	
132	Enter the field containing the list you want to separate out into individual items.
133	
134	If you're working with binary data inputs, use $binary in an expression to set the field to split out.
135	
136	Include#
137	
138	Select whether and how you want n8n to keep any other fields from the input data with each new individual item.
139	
140	You can select:
141	
142	No Other Fields: No other fields will be included.
143	All Other Fields: All other fields will be included.
144	Selected Other Fields: Only the selected fields will be included.
145	Fields to Include: Enter a comma separated list of the fields you want to include.
146	Node options#
147	Disable Dot Notation#
148	
149	By default, n8n enables dot notation to reference child fields in the format parent.child. Use this option to disable dot notation (turned on) or to continue using dot (turned off).
150	
151	Destination Field Name#
152	
153	Enter the field in the output where the split field contents should go.
154	
155	Include Binary#
156	
157	Choose whether to include binary data from the input in the new output (turned on) or not (turned off).
158	
159	Templates and examples#
160	Scrape and summarize webpages with AI
161	
162	by n8n Team
163	
164	View template details
165	Scrape business emails from Google Maps without the use of any third party APIs
166	
167	by Akram Kadri
168	
169	View template details
170	Automated Web Scraping: email a CSV, save to Google Sheets & Microsoft Excel
171	
172	by Mihai Farcas
173	
174	View template details
175	Browse Split Out integration templates, or search all templates
176	Related resources#
177	
178	Learn more about data structure and data flow in n8n workflows.
179	
180	Chat with the docs
181	This page was
182	Helpful
183	Not helpful
184	 Back to top
185	Previous
186	Sort
187	Next
188	SSE Trigger
189	Made with Material for MkDocs Insiders