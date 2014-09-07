package com.onevision.angular.importer;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.CopyUtils;
import org.apache.commons.io.IOUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Dummy API servlet to serve and receive the various AJAX requests.
 */
public class DummyApiServlet extends HttpServlet {
	private static final Logger LOGGER = LogManager
			.getLogger(DummyApiServlet.class);
	private int nextId = 10;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		// Turn off the caching.
		resp.setHeader("Cache-Control",
				"private, no-store, no-cache, must-revalidate");
		resp.setHeader("Pragma", "no-cache");

		String requestURI = req.getRequestURI();
		LOGGER.info("Requested resolution of '{}'", requestURI);

		if (requestURI.contains("/import/")) {
			handleImportDetailsRequest(requestURI, resp);
		}

		try (InputStream inputStream = findCorrectStream(requestURI)) {
			if (inputStream != null) {
				try (OutputStream output = resp.getOutputStream()) {
					IOUtils.copy(inputStream, output);
					output.flush();
				}
			} else {
				LOGGER.error("Null input found so returning 404 for {}", requestURI);
				resp.setStatus(404);
			}
		}
	}

	private void handleImportDetailsRequest(String requestURI,
			HttpServletResponse resp) {
		StringBuilder importJson = new StringBuilder();
		/*
		 * { "jobId" : "ABCD-EFGH-IJKL-MNOP", "description" :
		 * "Simple import to get the system checks started", "date" :
		 * "2014-09-03T18:25:43.511Z", "status" : "DOWNLOADABLE", "importer":
		 * "me" }
		 */
		importJson.append("{ \"id\" : ");
		importJson.append(nextId++);
		importJson.append(", \"jobId\" : \"ABCD-1234-EFGH-1234\"");
		importJson.append(", \"description\" : \"Details for the import\"");
		importJson.append(", \"date\" : \"2014-09-03T18:25:43.511Z\"");
		importJson.append(", \"status\" : \"IN_PROGRESS\"");
		importJson.append(", \"importer\" : \"me\"");
		importJson.append(", \"recipient\" : \"me\"");
		importJson.append(", \"fileCount\" : 4");
		importJson.append(", \"files\" : []");
		importJson.append("}");
		try (OutputStream output = resp.getOutputStream()) {
			IOUtils.copy(new ByteArrayInputStream(importJson.toString()
					.getBytes("UTF-8")), output);
			output.flush();
		} catch (IOException e) {
			LOGGER.fatal("Error rendering the import details for {}",
					requestURI);
			try {
				resp.sendError(500, "Rendering of JSON failed.");
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}
	}

	private InputStream findCorrectStream(String requestURI) {

		ClassLoader contextClassLoader = Thread.currentThread().getContextClassLoader();
		if (requestURI.endsWith("activities")) {
			return contextClassLoader
					.getResourceAsStream("/data/activities.json");
		}
		if (requestURI.endsWith("myImports")) {
			return contextClassLoader
					.getResourceAsStream("/data/myImports.json");
		}
		if (requestURI.endsWith("navLinks")) {
			return contextClassLoader
					.getResourceAsStream("/data/navLinks.json");
		}
		if (requestURI.endsWith("queryProperties")) {
			return contextClassLoader
					.getResourceAsStream("/data/queryProperties.json");
		}
		if (requestURI.endsWith("rules")) {
			return contextClassLoader
					.getResourceAsStream("/data/rules.json");
		}
		if (requestURI.endsWith("versionInfo")) {
			return contextClassLoader
					.getResourceAsStream("/data/versionInfo.json");
		}
		return null;
	}
}
