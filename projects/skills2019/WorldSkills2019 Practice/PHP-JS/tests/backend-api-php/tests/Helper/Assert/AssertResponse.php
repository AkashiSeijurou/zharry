<?php

namespace WorldSkills\Trade17\Tests\Helper\Assert;

use WorldSkills\Trade17\Tests\Helper\Http\Response;

trait AssertResponse
{
    /**
     * Assert if status code equals
     */
    public function assertStatusCode(int $expected, Response $res)
    {
        $actual = $res->getStatusCode();
        $this->assertEquals($expected, $actual, 'Expected response status code to equal '.$expected.' but got '.$actual.'.');
    }

    /**
     * Assert if status code is one of the expected ones
     */
    public function assertStatusCodes(array $expected, Response $res)
    {
        $actual = $res->getStatusCode();
        $this->assertEquals(true, in_array($actual, $expected), 'Expected response status code to be one of '.implode(', ', $expected).', got '.$actual.'.');
    }

    /**
     * Assert if the response contains the header and equals the expected value
     */
    public function assertHeadersEqual(array $expectedHeaders, Response $res)
    {
        foreach (array_keys($expectedHeaders) as $headerKey) {
            $this->assertNotNull($res->getHeader($headerKey), 'Response does not contain header ' . $headerKey . '.');
            $this->assertGreaterThan(0, count($res->getHeader($headerKey)), 'Response does not contain header '.$headerKey.'.');
            if (is_array($expectedHeaders[$headerKey])) {
                $this->assertEquals($expectedHeaders[$headerKey], $res->getHeader($headerKey), 'Header '.$headerKey.' does not equal to "'.implode(', ', $expectedHeaders[$headerKey]).'".');
            } else {
                $this->assertEquals([$expectedHeaders[$headerKey]], $res->getHeader($headerKey), 'Header '.$headerKey.' does not equal to "'.$expectedHeaders[$headerKey].'".');
            }
        }
    }

    /**
     * Assert if the response contains the header and equals the expected value
     */
    public function assertHeadersContains(array $expectedHeaders, Response $res)
    {
        foreach (array_keys($expectedHeaders) as $headerKey) {
            $this->assertNotNull($res->getHeader($headerKey), 'Response does not contain header ' . $headerKey . '.');
            $this->assertGreaterThan(0, count($res->getHeader($headerKey)), 'Response does not contain header '.$headerKey.'.');
            if (is_array($expectedHeaders[$headerKey])) {
                foreach ($expectedHeaders[$headerKey] as $expectedHeader) {
                    $this->assertContains($expectedHeader, $res->getHeader($headerKey), 'Header '.$headerKey.' does not contain "'.$expectedHeader.'".');
                }
            } else {
                $this->assertContains($expectedHeaders[$headerKey], $res->getHeader($headerKey), 'Header '.$headerKey.' does not contain "'.$expectedHeaders[$headerKey].'".');
            }
        }
    }

    /**
     * Assert if the response equals.
     * Order in the array is ignored.
     */
    public function assertResponse($expected, Response $res)
    {
        $this->assertEquals($expected, $res->getJson());
    }

    /**
     * Assert if a single item in a response array equals
     */
    public function assertResponseItem(int $index, $expected, Response $res)
    {
        $this->assertEquals($expected, $res->getJson()[$index], 'Response item at index '.$index.' does not equal the expected one.');
    }

    /**
     * Assert if the amount of items in the response equals
     */
    public function assertResponseItemCount(int $expected, Response $res)
    {
        $parsed = $res->getJson();
        $actual = count($parsed);
        $this->assertEquals($expected, $actual, 'Expected number of items in response to equal '.$expected.', got '.$actual.'.');
    }
}
