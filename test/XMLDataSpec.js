"use strict";

import XMLData from "../src/XMLData.js";
import config from "../config.js";
import { expect, assert } from "chai";
import nock from "nock";

describe("XMLData", () => {
    it("should get the XML data from the server", function() {
        let data = `<?xml version="1.0" encoding="utf-8" ?>
                     <rss version="2.0" xml:base="http://www.nasa.gov/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:media="http://search.yahoo.com/mrss/"> <channel>
                    <item>
                     <title>NASA Administrator Remembers Apollo-Era Astronaut Edgar Mitchell</title>
                     <link>http://www.nasa.gov/press-release/nasa-administrator-remembers-apollo-era-astronaut-edgar-mitchell</link>
                     <description>The following is a statement from NASA Administrator Charles Bolden on the passing of NASA astronaut Edgar Mitchell:</description>
                    </item>

                    <item>
                     <title>NASA Television to Air Russian Spacewalk</title>
                     <link>http://www.nasa.gov/press-release/nasa-television-to-air-russian-spacewalk</link>
                     <description>NASA Television will broadcast live coverage of a 5.5-hour spacewalk by two Russian cosmonauts aboard the International Space Station beginning at 7:30 a.m. EST Wednesday, Feb. 3.</description>
                    </item>
                    </channel>
                    </rss>`;

        nock("http://localhost:3000", {
                reqheaders: {
                    'authorization': 'Basic abcdefgh='
                }
            })
            .get("/data.xml")
            .reply(200, data, {
                'Content-Type': 'application/xml'
              });

        let xmlData = new XMLData("http://localhost:3000/data.xml");
        let headers = {
            "Authorization": "Basic abcdefgh="
        }
        return xmlData.get(headers).then(successData => {
            assert.isObject(successData);
        });
    });

    it("should be able to handle the error case", function() {
        nock("http://localhost:3000")
            .get("/data.xml")
            .reply(400, { "data": "success1" });

        let xmlData = new XMLData("http://localhost:3000/data.xml");

        return xmlData.get().catch(error => {
            expect(error.message).to.eq("unable to fetch the data");
        });
    });
})
