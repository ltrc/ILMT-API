#!/bin/bash
for module in ./modules/*;
do
    export PERL5LIB=$PERL5LIB:${module}/lib/;
done
