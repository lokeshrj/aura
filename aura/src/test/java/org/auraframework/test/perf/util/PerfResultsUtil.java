/*
 * Copyright (C) 2013 salesforce.com, inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.auraframework.test.perf.util;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import junit.framework.AssertionFailedError;

import org.auraframework.util.IOUtil;
import org.auraframework.util.test.perf.metrics.PerfMetrics;
import org.bson.Document;
import org.json.JSONException;
import org.json.JSONObject;

import com.google.common.collect.Maps;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
public final class PerfResultsUtil {

	private static final Logger LOG = Logger.getLogger(PerfResultsUtil.class.getSimpleName());	
	public static final Date RUN_TIME = new Date();
	public static final String MONGO_URI = System.getProperty("mongoURI");
    public static MongoClient MONGO_CLIENT; // TODO: Abstract this better

    private static MongoClient getMongoClient () {
    	if (MONGO_CLIENT == null) {
    		try {
    			LOG.info("Trying to connect to MongoDB: " + MONGO_URI);
    			MongoClientURI uri  = new MongoClientURI(MONGO_URI);
    			MONGO_CLIENT = new MongoClient(uri);
    		} catch (Exception e) {
    			LOG.info("Not able to connect to MongoDB");
    			return null;
    		}
    	}
    	return MONGO_CLIENT;
    }
    
    public static void writeToDb (PerfMetrics metrics, String test) {
    	try {
			MongoClient mongo = getMongoClient();
			if (mongo != null) {
				MongoDatabase db = mongo.getDatabase("performance");
				MongoCollection<Document> runs = db.getCollection("testRun");
				JSONObject json = metrics.toJSONObject();
				Document doc = Document.parse(json.toString());
		        doc.append("testName", test);
		        doc.append("run", RUN_TIME);
				runs.insertOne(doc);
			}
    	} catch (Exception e) {
    		e.printStackTrace();
    	}
    }

    /**
     * Writes the dev tools log for a perf test run to
     * System.getProperty("aura.perf.results.dir")/timelines/testName_timeline.json
     * 
     * @return the written file
     */
    public static File writeDevToolsLog(List<JSONObject> timeline, String fileName) {
        File file = PerfFilesUtil.getTimelineResultsDir(fileName);
        BufferedWriter writer = null;
        try {
            file.getParentFile().mkdirs();
            writer = new BufferedWriter(new FileWriter(file));
            writer.write('[');
            for (JSONObject entry : timeline) {
                writer.newLine();
                writer.write(entry.toString());
                writer.write(',');
            }
            writer.write("]");
            writer.newLine();
            LOG.info("wrote dev tools log: " + file.getAbsolutePath());
        } catch (Exception e) {
            LOG.log(Level.WARNING, "error writing " + file.getAbsolutePath(), e);
        } finally {
            IOUtil.close(writer);
        }
        return file;
    } 
    
	/**
     * @return the written file
     */
    public static File writeGoldFile(PerfMetrics metrics, String fileName) {
    	try {
			ALL_GOLDFILES_JSON.addGoldfile(fileName, metrics);
		} catch (JSONException e) {
			LOG.log(Level.WARNING, "error generating _all.json", e);
		}
    	File file = PerfFilesUtil.getGoldfilesResultsDir(fileName);
        return writeFile(file, PerfFilesUtil.toGoldFileText(metrics, false), "goldfiles");
    	
    }
    
    private static File writeFile(File file, String contents, String what) {
        OutputStreamWriter writer = null;
        try {
            IOUtil.mkdirs(file.getParentFile());
            writer = new OutputStreamWriter(new FileOutputStream(file), "UTF-8");
            writer.write(contents);            
            LOG.info("wrote " + what + ": " + file.getAbsolutePath());
            return file;
        } catch (Exception e) {
            LOG.log(Level.WARNING, "error writing " + file.getAbsolutePath(), e);
            return file;
        } finally {
            IOUtil.close(writer);
        }
    }
    
    public static void assertPerfDiff(PerfExecutorTest test, String resultsBaseFilename, PerfMetrics actual) throws Exception {
        DiffUtil<PerfMetrics> diff = new PerfDiffUtil(test, resultsBaseFilename);
        assertDiff(actual, diff);
    }

    private static <T> void assertDiff(T testResults, DiffUtil<T> diff) throws Exception {
    	URL url = diff.getUrl();
        Throwable exceptionFound = null;
        String message = null;

        try {
            diff.assertDiff(testResults);
        } catch (FileNotFoundException e) {
            exceptionFound = e;
            message = String.format("Missing gold file, commit a goldfile at this url: %s", url);
        } catch (Throwable t) {
            exceptionFound = t;
            message = "Gold file differences found";
            message += "\nDifferences";
            if (testResults instanceof PerfMetrics) {
                message += " using the median (*) perf test run metric values";
            }
            message += ":\n" + t.getMessage();
        }

        if (exceptionFound != null) {
            // add info about creating/updating log file in the assertion message
            Error error = new AssertionFailedError(message);
            //error.setStackTrace(exceptionFound.getStackTrace());
            throw error;
        } 
    }
    
    // write a _all.json for each namespace
    private static final AllGoldfilesJSON ALL_GOLDFILES_JSON = new AllGoldfilesJSON(true);

    /**
     * Writes a single _all.json containing all the goldfiles in a namespace
     */
    private static final class AllGoldfilesJSON {
        private final Map<String, JSONObject> resultsJson = Maps.newHashMap();

        AllGoldfilesJSON(boolean writeOnJVMExit) {
            if (writeOnJVMExit) {
                Runtime.getRuntime().addShutdownHook(new Thread() {
                    @Override
                    public void run() {
                    	addBuildArtifacts();
                        if (resultsJson.size() > 0) {
                            	File file = new File(PerfFilesUtil.getPerfResultsDir() + "/goldfiles/_all.json");
                                writeFile(file, resultsJson.get("results").toString(), "/_all.json");
                        }                        
                    }
                });
            }
        }

        void addGoldfile(String fileName, PerfMetrics metrics) throws JSONException {
            if (!resultsJson.containsKey("results")) {
            	resultsJson.put("results", new JSONObject());
            }
            JSONObject allJson = resultsJson.get("results");
            allJson.put(fileName, metrics.toJSONArrayWithoutDetails());
        }
        
        void addBuildArtifacts() {
        	JSONObject build = new JSONObject();
            try {
    	        addBuildInfo(build, "jenkins_build_number", "BUILD_NUMBER");
    	        addBuildInfo(build, "jenkins_build_id", "BUILD_ID");
    	        addBuildInfo(build, "git_branch", "GIT_BRANCH", "CURRENT_GIT_BRANCH");
    	        addBuildInfo(build, "git_commit", "GIT_COMMIT", "CURRENT_GIT_COMMIT");
    	        addBuildInfo(build, "aura_version", "AURA_VERSION");
    	        addBuildInfo(build, "author_email", "AUTHOR_EMAIL");
    	        addBuildInfo(build, "changelists", "CHANGELISTS");
            
    	        JSONObject allJson = resultsJson.get("results");
    	        allJson.put("build", build);
            } catch (JSONException e) {
    			// TODO Auto-generated catch block
    			e.printStackTrace();
    		}
        }
        
        void addBuildInfo(JSONObject build, String key, String... envvars) throws JSONException {
            for (String envvar : envvars) {
                String value = System.getenv(envvar);
                if (value != null && value.trim().length() > 0) {
                    build.put(key, value);
                    return; // uses first non-null
                }
            }
        }
    }
    
}